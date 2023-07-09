from django.http import Http404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from lead.models import Lead
from team.models import Team

from .models import Client

@api_view(['GET'])
def get_clients_count(request):
    leads = Client.objects.all()
    id = request.GET.get('id')
    return Response({
        'count': len(leads.filter(team_id__in=[id]))
    }, 200)

@api_view(['POST'])
def convert_lead_to_client(request):
    team = Team.objects.filter(members__in=[request.user]).first()
    lead_id = request.data['lead_id']

    try:
        lead = Lead.objects.filter(team=team).get(pk=lead_id)
    except Lead.DoesNotExist:
        raise Http404
    
    Client.objects.create(
        team=team, 
        name=lead.company,
        contact_person=lead.contact_person,
        email=lead.email,
        phone=lead.phone,
        website=lead.website,
        created_by=request.user)
    
    lead.converted_to_client = True
    lead.save()

    return Response(status=201)

@api_view(['DELETE'])
def delete_client(request, client_id):
    client = Client.objects.get(pk=client_id)
    client.delete()

    return Response()