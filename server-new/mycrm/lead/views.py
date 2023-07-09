from django.contrib.auth.models import User
from django.db.models.query import prefetch_related_objects

#from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Lead
from .serializers import LeadSerializer, \
    LeadReducedSerializer, \
    LeadSummarizedSerializer

from team.models import Team

class LeadPagination(PageNumberPagination):
    #number of items per page
    page_size = 2

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    http_method_names = ['post', 'get', 'patch' ]
    pagination_class = LeadPagination
    filter_backends = (filters.SearchFilter, )
    search_fields = ('company', 'contact_person', )
    #<model>.objects.all() returns all
    #serialized fields in the seriallizer class
    #queryset is a set of data that will
    #be sent to a requestor after
    #it's formatted
    queryset = Lead.objects.all()

    #Override this method so that we can
    #filter the queryset
    #This function only returns leads that
    #are owned by a specific user
    def get_queryset(self):
        team = Team.objects.filter(members__in=[self.request.user]).first()
        return self.queryset.filter(team=team)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = LeadSummarizedSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = LeadSummarizedSerializer(queryset, many=True)
        return Response(serializer.data)

    #for get endpoint with id
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = LeadReducedSerializer(instance)
        return Response(serializer.data)

    def create(self, request):
        member = self.request.data['assigned_to']
        user = User.objects.filter(username=member).first()

        #is user exists, a lead can be assigned to that
        #user
        if(user != None or member == ''):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(status=404, 
                            data={"message":
                                  "User in 'Assigned to' field doesn't exist!"})

    #created_by is a read-only field and it's not included in the required
    #field in the serializer of this view. We need to fill this field
    #up manually.
    #That's why we override create and call serializer.save() and put
    #the value in the argument list.
    
    #This function is called in the create() function of serializer
    def perform_create(self, serializer):
        user = User.objects.filter(username=self.request.data["assigned_to"]).first()
        team = Team.objects.filter(members__in=[self.request.user]).first()
        serializer.save(team=team, created_by=self.request.user, assigned_to=user)

    def update(self, request, *args, **kwargs):
        member = self.request.data['assigned_to']
        #User.objects.get() raises an error if a query found no match
        #This is the error that we will get
        #django.contrib.auth.models.User.DoesNotExist: User matching query does not exist.
        #use filter().first() if you don't  want to raise an error is user is not found 
        user = User.objects.filter(username=member).first()
        #is user exists, a lead can be assigned to that
        #user
        if(user != None):
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            queryset = self.filter_queryset(self.get_queryset())
            if queryset._prefetch_related_lookups:
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the instance,
                # and then re-prefetch related objects
                instance._prefetched_objects_cache = {}
                prefetch_related_objects([instance], *queryset._prefetch_related_lookups)

            return Response(serializer.data)
        else:
            return Response(status=404, 
                            data={"message":
                                  "User in 'Assigned to' field doesn't exist!"})

    def perform_update(self, serializer):
        member = self.request.data['assigned_to']
        user = User.objects.get(username=member)
        serializer.save(assigned_to=user)