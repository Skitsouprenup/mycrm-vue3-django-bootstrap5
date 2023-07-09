from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .stripe_views import \
    get_stripe_pub_key,\
    create_checkout_session,\
    stripe_webhook, \
    check_stripe_subscription, \
    cancel_team_plan

from .views import TeamViewSet, \
        UserDetail, \
        get_user_team, \
        add_member, \
        get_plans

router = DefaultRouter()
router.register('teams', TeamViewSet, basename='teams')

urlpatterns = [
    #Generated endpoints
    path('', include(router.urls)),
    #endpoint with different view(APIview)
    #as_view() is a way to initialize and use a class-based view
    path('teams/member/<int:pk>/', UserDetail.as_view()),
    path('teams/myteam', get_user_team, name='get_user_team'),
    path('teams/plans', get_plans, name='get_plans'),
    path('teams/add/member', add_member, name='add_member'),
    path('stripe/key/public', get_stripe_pub_key, name='get_stripe_pub_key'),
    path('stripe/checkout/plan', create_checkout_session, name='create_checkout_session'),
    path('stripe/webhook', stripe_webhook, name='stripe_webhook'),
    path('stripe/subscription', check_stripe_subscription, name='check_stripe_subscription'),
    path('stripe/subscription/cancel', cancel_team_plan, name='cancel_team_plan')
]
