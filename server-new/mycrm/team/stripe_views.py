import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from datetime import datetime

from .models import Team, Plan
from .serializers import PlanSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_stripe_pub_key(request):
    pub_key = settings.STRIPE_PUB_KEY

    return Response({ 'key': pub_key })

@api_view(['POST'])
def create_checkout_session(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    plan = request.data['plan']

    if plan == 'Small Team':
        price_id = settings.STRIPE_SMALL_TEAM_PRICE_ID
    else:
        price_id = settings.STRIPE_BIG_TEAM_PRICE_ID

    team = Team.objects.filter(members__in=[request.user]).first()

    try:
        checkout_session = stripe.checkout.Session.create(
            client_reference_id = team.id,
            success_url = '%s?session_id={CHECKOUT_SESSION_ID}' % \
            settings.FRONTEND_URL_UPGRADE_PLAN_SUCCESS,
            cancel_url = settings.FRONTEND_URL_UPGRADE_PLAN_CANCEL,
            payment_method_types = ['card', ],
            mode = 'subscription',
            line_items = [
                {
                    'price': price_id,
                    'quantity': 1
                }
            ]
        )
        return Response({'sessionId': checkout_session['id']})
        
    except Exception as e:
        return Response({ 'error': str(e) }, status=500)

@api_view(['PUT'])
def cancel_team_plan(request):
    team = Team.objects.filter(members__in=[request.user]).first()
    free_plan = Plan.objects.get(name='Free')

    try:
        if(team.stripe_subscription_id != None):
            stripe.api_key = settings.STRIPE_SECRET_KEY
            stripe.Subscription.delete(team.stripe_subscription_id)

        team.plan = free_plan
        team.plan_status = team.PLAN_CANCELLED
        team.stripe_customer_id = None
        team.stripe_subscription_id = None
        team.plan_end_date = None
        team.save()

        serializer = PlanSerializer(team.plan)
        return Response(serializer.data)

    except Exception:
        return Response({'error': 'Internal Server Error'}, status=500)

@api_view(['POST'])
def check_stripe_subscription(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY

    try:
        team = Team.objects.filter(members__in=[request.user]).first()
        subscription = stripe.Subscription.retrieve(team.stripe_subscription_id)
        product = stripe.Product.retrieve(subscription.plan.product)

        team.plan_status = team.PLAN_ACTIVE
        team.plan_end_date = datetime.fromtimestamp(subscription.current_period_end)
        team.plan = Plan.objects.get(name=product.name)
        team.save()

        serializer = PlanSerializer(team.plan)
        return Response(serializer.data, status=201)

    except Exception as e:
        return Response({ 'error': str(e) }, status=500)

#exempt this from csrf token requirement because 
#we're requesting from external endpoint(stripe) and that endpoint
#is not part of our application. For that reason, the external endpoint
#can't generate the required csrf token of our app
#Note: Make sure to only exempt trusted endpoints or else your app
#may become vulnerable to bad actors
#source: https://docs.djangoproject.com/en/4.2/ref/csrf/
@csrf_exempt
def stripe_webhook(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    webhook_key = settings.STRIPE_WEBHOOK_KEY
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_key)
    except ValueError as e:
        #stripe endpoint accepts HttpResponse not Response. HttpResponse is 
        #simply a response formatted as string
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse({'error': str(e)},status=400)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        team = Team.objects.get(pk=session.get('client_reference_id'))
        team.stripe_customer_id = session.get('customer')
        team.stripe_subscription_id = session.get('subscription')
        team.save()

    return HttpResponse(status=200) 