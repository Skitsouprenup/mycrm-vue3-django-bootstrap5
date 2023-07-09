from django.contrib.auth.models import User
from django.db import models

from team.models import Team

#models contains the content of a database table

class Lead(models.Model):

    #status
    NEW = 'new'
    CONTACTED = 'contacted'
    INPROGRESS = 'inprogress'
    LOST = 'lost'
    WON = 'won'

    #left side: key identifier to identify column
    #right side: Column name in database
    STATUS_SELECTION = (
        (NEW, 'New'),
        (CONTACTED, 'Contacted'),
        (INPROGRESS, 'In_progress'),
        (LOST, 'Lost'),
        (WON, 'Won')
    )

    #priorities
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'

    PRIORITIES_SELECTION = (
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High')
    )

    team = models.ForeignKey(Team, related_name='leads', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, related_name='assigned_leads', on_delete=models.SET_NULL, blank=True, null=True)
    company = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=255)
    website = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=25, choices=STATUS_SELECTION, default=NEW)
    confidence = models.IntegerField()
    estimated_value = models.IntegerField()
    priority = models.CharField(
        max_length=25, 
        choices=PRIORITIES_SELECTION, 
        default=LOW 
    )
    created_by = models.ForeignKey(User, related_name='leads', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    converted_to_client = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']
