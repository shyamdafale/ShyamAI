class Employee:

    company = "GenAI Solutions"

    def __init__(self, emp_id, name, salary) -> None:
        self.emp_id = emp_id
        self.name = name

        self.__salary = salary

    def get_salary(self):
        return self.__salary
    
    def work(self):
        print(f"{self.name} is currently working...")

    @staticmethod
    def company_policy():
        print("Office timing: 10AM - 6PM")

    def __str__(self) -> str:
        return f"{self.name} <<-->> {self.emp_id}"
    

# Single Inheritance
class Developer(Employee):

    def code(self):
        print(f"{self.name} is writing Python code...")

# Multilevel Inheritance
class SeniorDeveloper(Developer):

    def review_code(self):
        print(f"{self.name} is reviewing all the pull requests..")


# Hierarchical Inheritance
# Developer(we already have) & Manager(yet to create) -> both inherits from Employee class
class Manager(Employee):
    def manage_team(self):
        print(f"{self.name} is managing the team...")

# Another Parent
class Trainer:
    def train(self):
        print("Conducting employee training...")

# Multiple Inheritance
class TechLead(Developer, Trainer):
    def lead_project(self):
        print(f"{self.name} is leading the project")

# ----------------------------------------------------        

dev = Developer(101, "Rahul", 70000)
senior = SeniorDeveloper(102, "Amit", 120000)
manager = Manager(103, "Priya", 100000)
lead = TechLead(104, "Sneha", 150000)

# print(dev)
# print(senior)
# print(manager)
# print(lead)

# senior.work()
# senior.code()
# senior.review_code()

# manager.manage_team()
# manager.work()

# lead.work()
# lead.code()
# lead.train()
# lead.lead_project()

# print(lead.get_salary())

Employee.company_policy()