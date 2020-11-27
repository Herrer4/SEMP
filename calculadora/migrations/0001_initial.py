# Generated by Django 3.1.3 on 2020-11-18 00:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Loan',
            fields=[
                ('interest_rate', models.FloatField()),
                ('installments', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, null=True)),
                ('cpf', models.CharField(max_length=11, null=True)),
                ('email', models.CharField(max_length=40, null=True)),
                ('loan_plan', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='calculadora.loan')),
            ],
        ),
    ]
