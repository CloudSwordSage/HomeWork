/*
 * @Time    : 2026/9/27 14:05:55
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : P51-6.cpp
 * @Desc    : 51页第6小问
 */
#include <iostream>
#include <vector>

template <class T>
struct Node {
        T data;
        Node<T> * next;
};

template <class T>
Node<T> * FindMaxNode(Node<T> * head) {
    if (head == nullptr) {
        return nullptr;
    }

    Node<T> * max = head;
    Node<T> * p = head->next;

    while (p != nullptr) {
        if (p->data > max->data) {
            max = p;
        }
        p = p->next;
    }

    return max;
}

Node<int> * BuildListNode(const std::vector<int> & data) {
    Node<int> * head = nullptr;
    Node<int> * tail = nullptr;

    for (int value : data) {
        Node<int> * node = new Node<int>{value, nullptr};

        if (head == nullptr) {
            head = node;
            tail = node;
        } else {
            tail->next = node;
            tail = node;
        }
    }

    return head;
}

void DeleteList(Node<int> * head) {
    while (head != nullptr) {
        Node<int> * temp = head;
        head = head->next;
        delete temp;
    }
}

void TestFindMax(const std::vector<int> & data, const char * testName) {
    Node<int> * head = BuildListNode(data);
    Node<int> * maxNode = FindMaxNode(head);

    std::cout << testName << ": ";

    if (maxNode == nullptr) {
        std::cout << "空链表，最大节点为空\n";
    } else {
        std::cout << "最大值 = " << maxNode->data << "\n";
    }

    DeleteList(head);
}

int main() {
    TestFindMax({}, "测试1 空链表");

    TestFindMax({5}, "测试2 单节点");

    TestFindMax({1, 3, 2}, "测试3 普通情况");

    TestFindMax({-5, -2, -10}, "测试4 负数");

    TestFindMax({7, 7, 3, 7}, "测试5 重复最大值");

    TestFindMax({10, 9, 8, 7}, "测试6 递减链表");

    TestFindMax({1, 2, 3, 4, 5}, "测试7 递增链表");

    return 0;
}
