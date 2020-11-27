from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path(
        '',
        views.index,
    ),

    path(
        'calculadora/',
        include('calculadora.urls'),
    ),

    path(
        'cadastros/',
        views.cadastros,
    ),

    path(
        'admin/',
        admin.site.urls,
    ),

] + static(settings.STATIC_URL)
