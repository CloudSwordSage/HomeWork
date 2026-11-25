#include <iostream>
#include <span>
#include <utility>

template <typename T>
struct Node {
    T val;
    Node * next;
    Node(T v, Node * n = nullptr) : val(v), next(n) {
    }
};

enum class States {
    ERROR,
    OK,
};

template <typename T>
class LinkedList {
    private:
    Node<T> * head = nullptr;

    public:
    LinkedList() {
        this->head = nullptr;
    }

    LinkedList(std::span<const T> arrs) {
        Node<T> * tail = nullptr;
        for (const T & v : arrs) {
            Node<T> * node = new Node<T>(v);
            if (nullptr == this->head) {
                this->head = node;
            } else {
                tail->next = node;
            }
            tail = node;
        }
    }

    LinkedList(const LinkedList & o) {
        Node<T> * tail = nullptr;
        Node<T> * cur = o.head;
        while (nullptr != cur) {
            Node<T> * node = new Node<T>(cur->val);
            if (nullptr == this->head) {
                this->head = node;
            } else {
                tail->next = node;
            }
            tail = node;
            cur = cur->next;
        }
    }

    auto operator=(const LinkedList & o) -> LinkedList & {
        if (this != &o) {
            LinkedList tmp(o);
            std::swap(this->head, tmp.head);
        }
        return *this;
    }

    ~LinkedList() {
        Node<T> * cur = this->head;
        while (nullptr != cur) {
            Node<T> * temp = cur;
            cur = cur->next;
            delete temp;
        }
    }

    auto getLength() -> int {
        int length = 0;
        Node<T> * cur = this->head;
        while (nullptr != cur) {
            length++;
            cur = cur->next;
        }
        return length;
    }

    auto getNodeByIndex(int index) -> Node<T> * {
        Node<T> * cur = this->head;
        int i = 0;
        while (nullptr != cur) {
            if (i == index) {
                return cur;
            }
            i++;
            cur = cur->next;
        }
        return nullptr;
    }

    auto findByValue(T val) -> int {
        Node<T> * cur = this->head;
        int i = 0;
        while (nullptr != cur) {
            if (cur->val == val) {
                return i;
            }
            i++;
            cur = cur->next;
        }
        return -1;
    }

    auto insertNode(int index, T value) -> States {
        if (index < 0) {
            return States::ERROR;
        }

        if (0 == index) {
            Node<T> * node = new Node<T>(value, this->head);
            this->head = node;
            return States::OK;
        }

        Node<T> * cur = this->head;
        int i = 1;
        while (nullptr != cur && i < index) {
            cur = cur->next;
            ++i;
        }

        if (nullptr == cur) {
            return States::ERROR;
        }

        Node<T> * node = new Node<T>(value, cur->next);
        cur->next = node;
        return States::OK;
    }

    auto deleteNode(int index) -> States {
        if (index < 0 || nullptr == this->head) {
            return States::ERROR;
        }

        if (0 == index) {
            Node<T> * temp = this->head;
            this->head = this->head->next;
            delete temp;
            return States::OK;
        }

        Node<T> * last = this->head;
        Node<T> * cur = this->head->next;
        int i = 1;
        while (nullptr != cur && i < index) {
            last = cur;
            cur = cur->next;
            ++i;
        }

        if (nullptr == cur) {
            return States::ERROR;
        }

        last->next = cur->next;
        delete cur;
        return States::OK;
    }

    auto traverseLinkedList() -> void {
        Node<T> * cur = this->head;
        while (nullptr != cur) {
            std::cout << cur->val << " -> ";
            cur = cur->next;
        }
        std::cout << "nullptr" << std::endl;
    }

    auto operator+=(const LinkedList & o) -> LinkedList & {
        if (this == &o) {
            LinkedList tmp(o);
            return *this += tmp;
        }

        Node<T> * tail = this->head;
        while (nullptr != tail && nullptr != tail->next) {
            tail = tail->next;
        }

        Node<T> * cur = o.head;
        while (nullptr != cur) {
            Node<T> * node = new Node<T>(cur->val);

            if (nullptr == this->head) {
                this->head = node;
            } else {
                tail->next = node;
            }

            tail = node;
            cur = cur->next;
        }

        return *this;
    }

    auto operator+(const LinkedList & o) -> LinkedList {
        LinkedList result;
        result += *this;
        result += o;
        return result;
    }
};

auto main() -> int {
    std::cout << "=== 单链表测试程序 ===\n\n";

    // 1. 测试初始化函数
    std::cout << "1. 测试初始化函数:\n";
    LinkedList<int> emptyList;
    std::cout << "空链表初始化成功\n";

    int arr1[] = {1, 3, 5, 7, 9};
    int arr2[] = {2, 4, 6, 8, 10};
    LinkedList<int> list1(arr1);
    LinkedList<int> list2(arr2);

    std::cout << "链表 1: ";
    list1.traverseLinkedList();
    std::cout << "链表 2: ";
    list2.traverseLinkedList();
    std::cout << "\n";

    // 2. 测试长度函数
    std::cout << "2. 测试长度函数:\n";
    std::cout << "链表 1 长度: " << list1.getLength() << "\n";
    std::cout << "链表 2 长度: " << list2.getLength() << "\n\n";

    // 3. 测试按位置查找
    std::cout << "3. 测试按位置查找:\n";
    Node<int> * node = list1.getNodeByIndex(2);
    if (node != nullptr) {
        std::cout << "索引 2 的值为: " << node->val << "\n";
    } else {
        std::cout << "索引 2 未找到\n";
    }
    std::cout << "\n";

    // 4. 测试按值查找
    std::cout << "4. 测试按值查找:\n";
    int idx = list1.findByValue(5);
    std::cout << "值 5 的索引为: " << idx << "\n\n";

    // 5. 测试插入操作
    std::cout << "5. 测试插入操作:\n";
    if (list1.insertNode(2, 99) == States::OK) {
        std::cout << "在索引 2 插入 99 成功: ";
        list1.traverseLinkedList();
    }
    std::cout << "\n";

    // 6. 测试删除操作
    std::cout << "6. 测试删除操作:\n";
    if (list1.deleteNode(3) == States::OK) {
        std::cout << "删除索引 3 成功: ";
        list1.traverseLinkedList();
    }
    std::cout << "\n";

    // 7. 测试合并操作
    std::cout << "7. 测试合并操作:\n";
    LinkedList<int> list3 = list1 + list2;
    std::cout << "list1 + list2 结果: ";
    list3.traverseLinkedList();

    list1 += list2;
    std::cout << "list1 += list2 结果: ";
    list1.traverseLinkedList();

    list1 += list1;
    std::cout << "list1 += list1 结果: ";
    list1.traverseLinkedList();
    std::cout << "\n";

    // 8. 测试空链表的各种操作
    std::cout << "8. 空链表操作测试:\n";
    std::cout << "空链表长度: " << emptyList.getLength() << "\n";
    std::cout << "按位置查找: "
              << (emptyList.getNodeByIndex(0) == nullptr ? "未找到" : "找到")
              << "\n";
    int emptyIdx = emptyList.findByValue(1);
    if (emptyIdx == -1) {
        std::cout << "按值查找: 未找到 (返回 -1)\n";
    } else {
        std::cout << "按值查找: 索引 " << emptyIdx << "\n";
    }

    // 删除空链表节点
    if (emptyList.deleteNode(0) == States::ERROR) {
        std::cout << "空链表删除操作: 失败 (符合预期)\n";
    }

    // 追加测试
    emptyList += list2;
    std::cout << "空链表 += list2 后: ";
    emptyList.traverseLinkedList();
    std::cout << "\n";

    // 9. 清理内存
    std::cout << "9. 清理内存:\n";
    std::cout << "退出作用域随类的销毁自动清理, 不提供手动清理方法\n";
    std::cout << "\n=== 测试完成 ===\n";

    return 0;
}
