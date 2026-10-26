#include <stdio.h>
#include <stdlib.h>

typedef struct Node
{
    int data;
    struct Node* next;
}node;

struct Node* create_linkedlist(int data)
{
    node* n = (node*)malloc(sizeof(node));
    n->data = data;
    n->next = NULL;
    return n;
}

void write_linkedlist(struct Node* head_of_list)
{
    node* iter = head_of_list;
    while(iter!=NULL)
    {
        printf("%d ",iter->data);
        iter = iter->next;
    }
    printf("\n-----------------------\n");
}

void add_node_head_of_linkedlist(struct Node** head_of_list, int data)
{
    node* temp = create_linkedlist(data);
    temp->next = *head_of_list;
    *head_of_list = temp;
}

void add_node_end_of_linkedlist(struct Node** head_of_list, int data)
{
    node* iter = *head_of_list;

    if(*head_of_list==NULL)
    {
        *head_of_list = create_linkedlist(data);
    }
    else
    {
        while(iter->next!=NULL)
        {
            iter = iter->next;
        }
        iter->next = create_linkedlist(data);
    }
}

void delete_node_from_linkedlist(struct Node** head_of_list, int data)
{
    node* temp;
    node* iter = *head_of_list;

    if(*head_of_list==NULL)
    {
        printf("The list is empty.\n");
    }
    else if((*head_of_list)->data==data)
    {
        temp = (*head_of_list)->next;
        free(*head_of_list);
        *head_of_list = temp;
    }
    else
    {
        while(iter!=NULL && iter->data!=data)
        {
            temp = iter;
            iter = iter->next;
        }

        if(iter==NULL)
        {
            printf("The list has not the data.\n");
        }
        else
        {
            temp->next = iter->next;
            free(iter);
        }
    }
}

void add_node_to_sorted_linkedlist(struct Node** head_of_list, int data)
{
    node* temp;
    node* iter = *head_of_list;

    if(*head_of_list==NULL)
    {
        *head_of_list = create_linkedlist(data);
    }
    else if(iter!=NULL && iter->data>data)
    {
        node* temp = create_linkedlist(data);
        temp->next = *head_of_list;
        *head_of_list = temp;
    }
    else
    {
        while(iter!=NULL && iter->data<data)
        {
            temp = iter;
            iter = iter->next;
        }
        temp->next = create_linkedlist(data);
        temp->next->next = iter;
    }
}

void liste_sirala(struct Node **liste_basi){
    struct Node *a,*b,*c,*d;

    if(*liste_basi == NULL || (*liste_basi)->next==NULL) return;
    d=(*liste_basi)->next;
    (*liste_basi)->next=NULL;

    while(d!=NULL)
    {
        c=d;
        d=d->next;
        b=*liste_basi;

        while(b!=NULL && b->data < c->data)
        {
            a=b;
            b=b->next;
        }

        if(b==*liste_basi)
        {
        c->next=*liste_basi;
        *liste_basi=c;
        }
        else
        {
            a->next = c;
            c->next = b;
        }
    }
}

void reverse_linkedlist(struct Node** head_of_list)
{
    node* temp;
    node* iter = (*head_of_list)->next;
    (*head_of_list)->next = NULL;

    if(*head_of_list == NULL)
    {
        printf("The list is empty.");
    }
    else
    {
        while(iter!=NULL)
        {
            temp = iter;
            iter = iter->next;
            temp->next = (*head_of_list);
            (*head_of_list) = temp;
        }
    }

}

int main()
{
    node* root = create_linkedlist(3);
    add_node_head_of_linkedlist(&root,2);
    add_node_head_of_linkedlist(&root,1);
    add_node_end_of_linkedlist(&root,4);
    add_node_end_of_linkedlist(&root,5);
    add_node_end_of_linkedlist(&root,6);
    add_node_end_of_linkedlist(&root,7);
    write_linkedlist(root);

    add_node_to_sorted_linkedlist(&root,5);
    write_linkedlist(root);

    add_node_to_sorted_linkedlist(&root,0);
    write_linkedlist(root);

    add_node_to_sorted_linkedlist(&root,8);
    write_linkedlist(root);

    reverse_linkedlist(&root);
    write_linkedlist(root);

    return 0;
}
