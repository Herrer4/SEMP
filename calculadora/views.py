from django.http import HttpResponse, JsonResponse
from django.template import loader

from .models import User, Loan

def index(request):    
    template = loader.get_template('calculadora.html')
    context = {}
    return HttpResponse(template.render(context, request))

def tabela(request):
    data = []
    loans = Loan.objects.all()
    
    for loan in loans:
        
        entry = {
            'parcelas': loan.installments,
            'juro': loan.interest_rate,
        }
        
        data.append(entry)
        
    return JsonResponse(data, safe=False)
