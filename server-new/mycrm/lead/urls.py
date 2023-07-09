from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LeadViewSet
from .lead_api_views import get_leads_count, delete_lead

router = DefaultRouter()
router.register('leads', LeadViewSet, basename='leads')

urlpatterns = [
    #I don't wanna add any strings to
    #my project's initial endpoint url in
    #<project-name>/urls.py
    path('', include(router.urls)),
    path('leads/team/leads_count', get_leads_count, name='get_leads_count'),
    path('leads/delete/<int:lead_id>', delete_lead, name='delete_lead')
]
