#include <stdio.h>
#include <stdlib.h>

typedef struct Person{
        char* name;
        int age;
}person;

typedef struct Student{
        int school_number;
        struct Person* p;
}student;

int main()
{
    /*struct Person p1;

    p1.name = "Ahmet";
    p1.age = 20;

    printf("Person's name: %s\n", p1.name);
    printf("Person's age: %d\n", p1.age);

    printf("-------------------------------------\n");

    displayPerson(p1);

    printf("-------------------------------------\n");

    student s1;
    s1.sNo = 2000;
    s1.p.age = 18;
    s1.p.name = "Ali";

    displayStudent(s1);

    printf("-------------------------------------\n");

    person* ptr = &p1;

    printf("Person's name: %s\n", ptr -> name);
    printf("Person's age: %d\n", ptr -> age);*/

    person p;
    p.age = 20;
    p.name = "Ahmet";

    printf("Struct'in adresi: %p\n", &p);
    printf("Name'in adresi: %p\n", &(p.name));
    printf("Age'in adresi: %p\n", &(p.age));

    printf("---------------------------------\n");


    student* std;

    std = (student*)malloc(sizeof(student));

    std -> school_number = 2005;
    std->p->name = "Selin";
    std->p->age = 24;

    printf("std pointerin adresi: %p\n", &std);
    printf("student'in adresi: %p\n", std);
    printf("student'in school_number'in adresi: %p\n", &(std->school_number));
    printf("student'in person'in adresi: %p\n", &(std->p));
    printf("student'in person'in name'in adresi: %p\n", &(std->p->name));
    printf("student'in person'in age'in adresi: %p\n", &(std->p->age));

    return 0;
}

void displayPerson(person p)
{
    printf("Person's name: %s\n", p.name);
    printf("Person's age: %d\n", p.age);
}

void displayStudent(student s)
{
    printf("Student's school number: %d\n", s.sNo);
    printf("Student's name: %s\n", s.p.name);
    printf("Student's age: %d\n", s.p.age);
}
