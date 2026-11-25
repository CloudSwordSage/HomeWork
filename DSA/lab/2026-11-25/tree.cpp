/*
 * @Time    : 2026/11/25 10:16:28
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : tree.cpp
 * @Desc    : 二叉树
 */

#include <sstream>
#include <iostream>
#include <queue>

struct Node {
    char val;
    Node * left;
    Node * right;
    Node(char val, Node * l = nullptr, Node * r = nullptr)
        : val(val), left(l), right(r) {
    }
};

auto createNode(char data) {
    Node * newNode = new Node(data);
    return newNode;
}

class BinaryTree {
    private:
    Node * root = nullptr;

    auto createTree(std::istream & in) -> Node * {
        char data;
        std::cout << "输入节点数据(输入#表示空节点): ";
        if (!(in >> data)) {
            return nullptr;
        }
        if (data == '#') {
            return nullptr;
        }
        Node * node = createNode(data);
        node->left = createTree(in);
        node->right = createTree(in);
        return node;
    }

    auto preOrderTraversal(Node * root) {
        if (root == nullptr) {
            return;
        }
        std::cout << root->val << " ";
        preOrderTraversal(root->left);
        preOrderTraversal(root->right);
    }

    auto inOrderTraversal(Node * root) {
        if (root == nullptr) {
            return;
        }
        inOrderTraversal(root->left);
        std::cout << root->val << " ";
        inOrderTraversal(root->right);
    }

    auto postOrderTraversal(Node * root) {
        if (root == nullptr) {
            return;
        }
        postOrderTraversal(root->left);
        postOrderTraversal(root->right);
        std::cout << root->val << " ";
    }

    auto destroyTree(Node * root) {
        if (root == nullptr) {
            return;
        }
        destroyTree(root->left);
        destroyTree(root->right);
        delete root;
    }

    public:
    BinaryTree() {
    }

    auto buildTree(std::istream & in) {
        this->root = createTree(in);
    }

    auto preOrderTraversal() {
        preOrderTraversal(this->root);
        std::cout << std::endl;
    }

    auto inOrderTraversal() {
        inOrderTraversal(this->root);
        std::cout << std::endl;
    }

    auto postOrderTraversal() {
        postOrderTraversal(this->root);
        std::cout << std::endl;
    }

    auto levelOrderTraversal() {
        Node * root = this->root;
        if (root == nullptr) {
            return;
        }
        std::queue<Node *> q;
        q.push(root);
        while (!q.empty()) {
            Node * node = q.front();
            q.pop();
            std::cout << node->val << " ";
            if (node->left != nullptr) {
                q.push(node->left);
            }
            if (node->right != nullptr) {
                q.push(node->right);
            }
        }
        std::cout << std::endl;
    }

    auto destroyTree() {
        destroyTree(this->root);
    }

    ~BinaryTree() {
        this->destroyTree();
    }
};

int main() {
    BinaryTree tree;
    std::cout << "构建二叉树: \n";
    std::istringstream in("ABD#G##E##CF###");
    tree.buildTree(in);
    std::cout << "\n=== 遍历测试 ===\n";
    std::cout << "前序遍历: ";
    tree.preOrderTraversal();
    std::cout << "中序遍历: ";
    tree.inOrderTraversal();
    std::cout << "后序遍历: ";
    tree.postOrderTraversal();
    std::cout << "层序遍历: ";
    tree.levelOrderTraversal();
    return 0;
}
