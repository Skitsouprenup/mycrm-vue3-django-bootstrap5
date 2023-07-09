#from django.shortcuts import render
from rest_framework.response import Response

from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Client, Note
from .serializers import ClientSerializer, ClientSummarizedSerializer, NoteSerializer

from team.models import Team

class ClientPagination(PageNumberPagination):
    page_size = 2

class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    http_method_names = ['post', 'get', 'patch' ]
    pagination_class = ClientPagination
    filter_backends = (filters.SearchFilter, )
    search_fields = ('name', 'contact_person', )

    queryset = Client.objects.all()

    def get_queryset(self):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        return self.queryset.filter(team=team)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ClientSummarizedSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ClientSummarizedSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        serializer.save(team=team, created_by=self.request.user)

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    http_method_names = ['post', 'get', 'patch' ]

    queryset = Note.objects.all()

    def get_queryset(self):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        #access query string of GET request
        client_id = self.request.GET.get('client_id')
        return self.queryset.filter(team=team).filter(client_id=client_id)
    
    def perform_create(self, serializer):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        client_id = self.request.data['client_id']
        serializer.save(team=team, created_by=self.request.user, client_id=client_id)