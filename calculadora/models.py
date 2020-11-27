from django.db import models

class Loan(models.Model):
    interest_rate = models.FloatField()
    installments = models.IntegerField(primary_key=True)

class User(models.Model):
    name = models.CharField(max_length=200, null=True)
    cpf = models.CharField(max_length=11, null=True)
    email = models.CharField(max_length=40, null=True)
    loan_plan = models.ForeignKey(Loan, null=True, on_delete=models.SET_NULL)


