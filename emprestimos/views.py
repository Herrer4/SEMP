from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

from calculadora.models import User, Loan

import json

def index(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))

# o cookie para proteção contra CSRF complica demais a programação
# desabilitando para simplificar este projeto.
@csrf_exempt
def cadastros(request):
    
    if request.method == 'GET':
        template = loader.get_template('cadastros.html')
        
        all_users = User.objects.all()
        
        users = []
        
        for user in all_users:
            
            user_data = {
                'name': user.name,
                'email': user.email,
                'cpf': user.cpf,
                'loan': '[TODO: EMPRÉSTIMO]',
            }
            
            users.append(user_data)
        
        context = {
            'users': users,
            'users_length': len(users),
        }
        
        return HttpResponse(template.render(context, request))
    
    if request.method == 'POST':
        
        body_unicode = request.body.decode('utf-8')
        json_data = json.loads(body_unicode)
        
        user = User(
            name=json_data['name'],
            cpf=json_data['cpf'],
            email=json_data['email'],
            loan_plan=None,
        )
        
        user.save()
        
        return HttpResponse('OK')
