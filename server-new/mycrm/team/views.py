from django.contrib.auth.models import User
from django.http import Http404

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Team, Plan
from .serializers import TeamSerializer,\
    UserSerializer,\
    UserPutSerializer,\
    PlanSerializer

# Create your views here.
class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()
    http_method_names = ['post', 'get', 'patch']

    #The queryset that this function going to use must be iterable
    #For example, object returned by filter() is iterable.
    #object return by filter().first() is not iterable
    #if the queryset is not iterable, you will receive this error
    #'Team' object is not iterable
    def get_queryset(self):
        return self.queryset.filter(members__in=[self.request.user])
    
    def perform_create(self, serializer):
        #save received data to database
        #This uses the UserSerializer assigned to created_by
        #in TeamSerializer in serializers.py
        obj = serializer.save(created_by=self.request.user)
        #members field holds the username that can be useful
        #for querying many-to-many relationship
        obj.members.add(self.request.user)
        #add() won't call save when invoked by a ManytoMany field.
        #We need to manually call save() to update the entry in
        #the database
        obj.save()

class UserDetail(APIView):
    http_method_names = ['get', 'put']

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserPutSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_plans(request):
    #Don't forget to set the many attribute to True
    #If you're going to serialize multiple table data
    serializer = PlanSerializer(Plan.objects.all(), many=True)
    return Response(serializer.data)
         
@api_view(['GET'])
def get_user_team(request):
    #Verify if a user is in a team. We just need a single entry
    team = Team.objects.filter(members__in=[request.user]).first()
    serializer = TeamSerializer(team)
    if(team != None):
        #serializer.data is a data that has been
        #serialized
        return Response(serializer.data, 200)
    return Response(status=404)

@api_view(['POST'])
def add_member(request):
    team = Team.objects.filter(members__in=[request.user]).first()
    email = request.data['email']
    status = ''

    #if team exists
    if(team != None):
        members = team.members.get(username=email)
        if(members == None):
            user = User.objects.get(username=email)
            team.members.add(user)
            team.save()
            return Response(status=204)
        else:
            status = 'Username is already part of the team'
    else:
        status = 'Team Doesn\'t Exist!'

    return Response(status=400, data={ 'status': status })