from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Lead

@api_view(['GET'])
def get_leads_count(request):
    leads = Lead.objects.all()
    id = request.GET.get('id')
    return Response({
        'count': len(leads.filter(team_id__in=[id]))
    }, 200)

@api_view(['DELETE'])
def delete_lead(request, lead_id):
    lead = Lead.objects.get(pk=lead_id)
    lead.delete()

    return Response()