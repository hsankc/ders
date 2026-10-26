#include <stdio.h>
#include <stdlib.h>

struct node{
    int key;
    struct node* left;
    struct node* right;
    int height;
};

struct node* newNode(int key){
    struct node* node = (struct node*)malloc(sizeof(struct node));
    node->key=key;
    node->left=node->right=NULL;
    node->height=1;
    return node;
};

void preOrder_yardimci(struct node* node){
    if(node!=NULL){
        printf("%d (%2d) ", node->key, node->height);
        preOrder_yardimci(node->left);
        preOrder_yardimci(node->right);
    }
}

void preOrder(struct node* node){
    preOrder_yardimci(node);
    printf("\n");
}

struct node* rightRotate(struct node* y){
    struct node* x = y->left, *T = x->right;
    x->right=y;
    y->left=T;
}

int main()
{
    struct node* n = newNode(3);
    n->left = newNode(4);
    n->left->left = newNode(6);
    n->right = newNode(5);
    preOrder(n);
    n = rightRotate(n);
    preOrder(n);
    return 0;
}
