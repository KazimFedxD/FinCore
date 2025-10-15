from __future__ import annotations

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Income, Expense
from backend.api import models

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_report(request: Request) -> Response:
    # Placeholder for report generation logic
    income = Income.objects.all().values('amount', 'date', 'category__name')
    expense = Expense.objects.all().values('amount', 'date', 'category__name')
    total_income = sum(item['amount'] for item in income)
    total_expense = sum(item['amount'] for item in expense)
    total_balance = total_income - total_expense
    report = {
        'total_income': total_income,
        'total_expense': total_expense,
        'total_balance': total_balance,
        'income_details': list(income),
        'expense_details': list(expense),
    }
    return Response(report)

class CategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        categories = Category.objects.all().values('id', 'name', 'type')
        return Response(list(categories))

    def post(self, request: Request) -> Response:
        data = request.data
        name = data.get('name')
        parent_name = data.get('parent')
        description = data.get('description', '')
        user = request.user
        
        if not name:
            return Response({'error': 'Category name is required'}, status=400)

        if parent_name:
            try:
                parent = Category.objects.get(name=parent_name)
            except Category.DoesNotExist:
                return Response({'error': 'Parent category does not exist'}, status=400)
        else:
            parent = None

        category = Category.objects.create(
            name=name,
            parent=parent,
            description=description,
            user=user
        )
        return Response({'id': category.id, 'name': category.name}, status=201)

    def delete(self, request: Request) -> Response:
        category_id = request.data.get('id')
        if not category_id:
            return Response({'error': 'Category ID is required'}, status=400)
        
        try:
            category = Category.objects.get(id=category_id)
            category.delete()
            return Response({'status': 'Category deleted'}, status=200)
        except Category.DoesNotExist:
            return Response({'error': 'Category does not exist'}, status=404)

class IncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        incomes = Income.objects.all().values('id', 'amount', 'date', 'category__name', 'description')
        return Response(list(incomes))

    def post(self, request: Request) -> Response:
        data = request.data
        amount = data.get('amount')
        date = data.get('date')
        category_name = data.get('category')
        description = data.get('description', '')
        user = request.user

        if not all([amount, date, category_name]):
            return Response({'error': 'Amount, date, and category are required'}, status=400)

        try:
            category = Category.objects.get(name=category_name)
        except Category.DoesNotExist:
            return Response({'error': 'Category does not exist'}, status=400)

        income = Income.objects.create(
            amount=amount,
            date=date,
            category=category,
            description=description,
            user=user
        )
        return Response({'id': income.id, 'amount': income.amount}, status=201)

    def delete(self, request: Request) -> Response:
        income_id = request.data.get('id')
        if not income_id:
            return Response({'error': 'Income ID is required'}, status=400)
        
        try:
            income = Income.objects.get(id=income_id)
            income.delete()
            return Response({'status': 'Income deleted'}, status=200)
        except Income.DoesNotExist:
            return Response({'error': 'Income does not exist'}, status=404)
        
class ExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        expenses = Expense.objects.all().values('id', 'amount', 'date', 'category__name', 'description')
        return Response(list(expenses))

    def post(self, request: Request) -> Response:
        data = request.data
        amount = data.get('amount')
        date = data.get('date')
        category_name = data.get('category')
        description = data.get('description', '')
        user = request.user

        if not all([amount, date, category_name]):
            return Response({'error': 'Amount, date, and category are required'}, status=400)

        try:
            category = Category.objects.get(name=category_name)
        except Category.DoesNotExist:
            return Response({'error': 'Category does not exist'}, status=400)

        expense = Expense.objects.create(
            amount=amount,
            date=date,
            category=category,
            description=description,
            user=user
        )
        return Response({'id': expense.id, 'amount': expense.amount}, status=201)

    def delete(self, request: Request) -> Response:
        expense_id = request.data.get('id')
        if not expense_id:
            return Response({'error': 'Expense ID is required'}, status=400)
        
        try:
            expense = Expense.objects.get(id=expense_id)
            expense.delete()
            return Response({'status': 'Expense deleted'}, status=200)
        except Expense.DoesNotExist:
            return Response({'error': 'Expense does not exist'}, status=404)
        