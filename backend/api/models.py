from __future__ import annotations

from django.db.models import *

from usermanagement.models import AuthAcc

# Create your models here.

class Category(Model):
    name = CharField(max_length=100, unique=True)
    description = TextField(blank=True, null=True)

    parent = ForeignKey(
        "self", on_delete=CASCADE, blank=True, null=True, related_name="children"
    )

    user = ForeignKey(AuthAcc, on_delete=CASCADE, related_name="categories", null=True, blank=True)
    
    root = BooleanField(default=False) # If True, This Category Can not be used Directly in Income or Expense
    
    def __str__(self) -> str:
        return self.name
    
        
class Income(Model):
    amount = FloatField()
    description = TextField(blank=True, null=True)
    date = DateField()
    category = ForeignKey(Category, on_delete=SET_NULL, null=True, related_name="incomes")

    user = ForeignKey(AuthAcc, on_delete=CASCADE, related_name="incomes")

    def __str__(self) -> str:
        return f"+{self.amount} on {self.date}"

        
class Expense(Model):
    amount = FloatField()
    description = TextField(blank=True, null=True)
    date = DateField()
    category = ForeignKey(Category, on_delete=SET_NULL, null=True, related_name="expenses")

    user = ForeignKey(AuthAcc, on_delete=CASCADE, related_name="expenses")

    def __str__(self) -> str:
        return f"-{self.amount} on {self.date}"

