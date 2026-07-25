
class BankAccount:

    # class attribute
    bank_name = "GenAI Bank"
    def __init__(self, account_number, holder_name, balance) -> None:
        self.account_number = account_number
        self.holder_name = holder_name

        # private attr
        self.__balance = balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"Rs.{amount}/- deposited successfully.")

    def withdraw(self, amount):
        if amount <= self.__balance:
            self.__balance -= amount
            print(f"Rs.{amount}/- withdrawn successfully.")
        else:
            print("Insufficient balance.")

    def get_balance(self):
        return self.__balance
    
    @staticmethod
    def calculate_interest(balance):
        return balance * 0.05
    
    def __str__(self) -> str:
        return f"{self.holder_name} <<-->> {self.account_number}"
    
    def __len__(self):
        return len(str(self.account_number))
    
acc1 = BankAccount(1001, "Rahul", 5000)
acc2 = BankAccount(1002, "Priya", 15000)

# print(acc1)
# print(acc2)

# acc1.deposit(3000)
# acc1.withdraw(2000)

# print(f"Available balance to {acc1}:\n{acc1.get_balance()}")


interest = BankAccount.calculate_interest(acc1.get_balance())
print(f"Interest applied to acc1: Rs{interest}/-")

print(f"Length of the acc1 account number: {len(acc1)}")
