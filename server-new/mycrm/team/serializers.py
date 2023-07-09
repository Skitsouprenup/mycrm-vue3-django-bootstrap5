from django.contrib.auth.models import User
from .models import Team, Plan
from rest_framework import serializers

class UserPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
        )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
        )

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    #read_only means that the field won't be part
    #of request field requirement
    #many means this column has many-to-many or many-to-one
    #relationship with the User table
    members = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    plan = PlanSerializer(read_only=True)

    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = (
            'created_at',
            'modified_at',
        )