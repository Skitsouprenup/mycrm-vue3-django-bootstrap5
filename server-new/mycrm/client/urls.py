from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import \
    ClientViewSet, \
    NoteViewSet \

from .client_api_views import \
    convert_lead_to_client, \
    get_clients_count, \
    delete_client

router = DefaultRouter()
router.register('clients', ClientViewSet, basename='clients')
router.register('notes', NoteViewSet, basename='notes')

urlpatterns = [
    path('convert_lead_to_client/', 
         convert_lead_to_client, 
         name='convert_lead_to_client'),
    path('', include(router.urls)),
    path('clients/team/clients_count', get_clients_count, name='get_clients_count'),
    path('clients/delete/<int:client_id>', delete_client, name='delete_client')
]
