from django.contrib import admin
from django.urls import path, include

from .views import *

urlpatterns = [
    path("auth/", include("usermanagement.urls")),
    path("categories/", CategoryView.as_view(), name="categories"),
    path("report/", get_report, name="report"),
    path('incomes/', IncomeView.as_view(), name='incomes'),
    path('expenses/', ExpenseView.as_view(), name='expenses'),
]
