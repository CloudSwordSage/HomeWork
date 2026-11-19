/*
 * @Time    : 2026/11/18 10:17:17
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : stack_queue.cpp
 * @Desc    : 栈和队列
 */

#include <iostream>
#include <type_traits>
#include <vector>
#include <variant>

constexpr int DEFAULT_INITIAL_CAPACITY = 100;

enum class States {
    Success,
    Error,
    Full,
    Empty,
};

template <typename T>
class Stack {
    private:
    std::vector<T> data;
    bool limited = false;

    public:
    Stack(int capacity = -1) {
        if (capacity > 0) {
            data.reserve(capacity);
            this->limited = true;
        } else {
            data.reserve(DEFAULT_INITIAL_CAPACITY);
        }
    }

    Stack(const Stack & o) {
        this->limited = o.limited;
        this->data.reserve(o.data.capacity());
        if constexpr (std::is_pointer_v<T>) {
            using Pointee = std::remove_pointer_t<T>;
            for (const auto & p : o.data) {
                if (p == nullptr) {
                    this->data.push_back(nullptr);
                } else {
                    this->data.push_back(new Pointee(*p));
                }
            }
        } else {
            this->data = o.data;
        }
    }

    auto operator=(const Stack & o) -> Stack & {
        if (this != &o) {
            Stack tmp(o);
            std::swap(this->data, tmp.data);
            std::swap(this->limited, tmp.limited);
        }
        return *this;
    }

    ~Stack() {
        if constexpr (std::is_pointer_v<T>) {
            for (auto & p : data) {
                delete p;
                p = nullptr;
            }
        }
    }

    auto push(T element) -> States {
        if (this->limited && this->data.size() == this->data.capacity()) {
            return States::Full;
        }
        data.push_back(element);
        return States::Success;
    }

    auto pop() -> std::variant<T, States> {
        if (this->data.empty()) {
            return States::Empty;
        }
        T element = this->data.back();
        data.pop_back();
        return element;
    }

    auto peek() -> std::variant<T, States> {
        if (this->data.empty()) {
            return States::Empty;
        }
        return this->data.back();
    }

    auto isEmpty() -> bool {
        if (this->data.empty()) {
            return true;
        }
        return false;
    }

    auto isFull() -> bool {
        if (this->limited && this->data.size() == this->data.capacity()) {
            return true;
        }
        return false;
    }

    auto destroyStack() -> void {
        if constexpr (std::is_pointer_v<T>) {
            for (auto & p : data) {
                delete p;
                p = nullptr;
            }
        }
        this->data.clear();
    }
};

template <typename T>
class Queue {
    private:
    std::vector<T> data;
    int front = 0;
    int rear = 0;

    auto cap() const -> int {
        return static_cast<int>(data.size());
    }

    auto releaseElements() -> void {
        if constexpr (std::is_pointer_v<T>) {
            for (int i = front; i != rear; i = (i + 1) % cap()) {
                delete data[i];
                data[i] = nullptr;
            }
        }
    }

    public:
    Queue(int capacity = 10) {
        if (capacity < 2) {
            capacity = 2;
        }
        this->data.resize(capacity);
    }

    Queue(const Queue & o) : data(), front(o.front), rear(o.rear) {
        this->data.resize(o.data.size());
        for (int i = o.front; i != o.rear; i = (i + 1) % o.cap()) {
            if constexpr (std::is_pointer_v<T>) {
                using Pointee = std::remove_pointer_t<T>;
                this->data[i] =
                    (o.data[i] == nullptr) ? nullptr : new Pointee(*o.data[i]);
            } else {
                this->data[i] = o.data[i];
            }
        }
    }

    auto operator=(const Queue & o) -> Queue & {
        if (this != &o) {
            Queue tmp(o);
            std::swap(this->data, tmp.data);
            std::swap(this->front, tmp.front);
            std::swap(this->rear, tmp.rear);
        }
        return *this;
    }

    ~Queue() {
        releaseElements();
    }

    auto Destroy() -> void {
        releaseElements();
        this->front = 0;
        this->rear = 0;
    }

    auto IsEmpty() -> States {
        if (this->rear == this->front) {
            return States::Empty;
        }
        return States::Success;
    }

    auto IsFull() -> States {
        if ((this->rear + 1) % cap() == this->front) {
            return States::Full;
        }
        return States::Success;
    }

    auto EnQueue(T e) -> States {
        if (this->IsFull() == States::Full) {
            return States::Full;
        }
        this->data[this->rear] = e;
        this->rear = (this->rear + 1) % cap();
        return States::Success;
    }

    auto DeQueue() -> std::variant<States, T> {
        if (this->IsEmpty() == States::Empty) {
            return States::Empty;
        }
        T e = this->data[this->front];
        this->data[this->front] = T{};
        this->front = (this->front + 1) % cap();
        return e;
    }

    auto GetHead() -> std::variant<States, T> {
        if (this->IsEmpty() == States::Empty) {
            return States::Empty;
        }
        return this->data[this->front];
    }

    auto PrintQueue() -> void {
        if (this->IsEmpty() == States::Empty) {
            std::cout << "当前队列：[ 空 ]" << std::endl;
            return;
        }
        std::cout << "当前队列 (front=" << this->front
                  << ", rear=" << this->rear << "): [ ";
        for (int i = this->front; i != this->rear; i = (i + 1) % cap()) {
            std::cout << this->data[i] << " ";
        }
        std::cout << "]" << std::endl;
    }
};

void stack_test() {
    Stack<int> stack;
    int element;

    // 入栈操作
    for (int i = 1; i <= 5; i++) {
        if (stack.push(i) == States::Success) {
            std::cout << "元素 " << i << " 入栈成功\n";
        } else {
            std::cout << "元素 " << i << " 入栈失败（栈已满）\n";
        }
    }

    // 读取栈顶元素
    auto peekResult = stack.peek();
    if (auto * val = std::get_if<int>(&peekResult)) {
        element = *val;
        std::cout << "栈顶元素: " << element << "\n";
    } else {
        std::cout << "栈为空，无法读取栈顶\n";
    }

    // 判定栈是否为空或满
    if (stack.isEmpty()) {
        std::cout << "栈为空\n";
    } else if (stack.isFull()) {
        std::cout << "栈已满\n";
    } else {
        std::cout << "栈不为空，也不满\n";
    }

    // 出栈操作
    while (!stack.isEmpty()) {
        auto popResult = stack.pop();
        if (auto * val = std::get_if<int>(&popResult)) {
            element = *val;
            std::cout << "元素 " << element << " 出栈\n";
        }
    }

    // 销毁栈
    stack.destroyStack();
    if (stack.isEmpty()) {
        std::cout << "栈已清空\n";
    }
}

void queue_test() {
    Queue<int> myQueue(9); // 实际最多存放 8 个元素

    // 小工具：判断结果是否为 int，并取出
    auto tryGet = [](const std::variant<States, int> & r, int & out) -> bool {
        if (const int * p = std::get_if<int>(&r)) {
            out = *p;
            return true;
        }
        return false;
    };

    int e = 0; // 用于接收出队或读取的元素

    // 1. 初始化（由构造函数完成）

    // 2. 判空
    std::cout << "队列是否为空? "
              << (myQueue.IsEmpty() == States::Empty ? "是" : "否")
              << std::endl;

    // 3. 入队
    myQueue.EnQueue(10);
    myQueue.EnQueue(20);
    myQueue.EnQueue(30);
    myQueue.PrintQueue();

    // 4. 读取队头
    if (tryGet(myQueue.GetHead(), e)) {
        std::cout << "当前队头元素是: " << e << std::endl;
    }
    myQueue.PrintQueue(); // 验证队头元素未被删除

    // 5. 出队
    if (tryGet(myQueue.DeQueue(), e)) {
        std::cout << "刚刚出队的元素是: " << e << std::endl;
    }
    myQueue.PrintQueue();

    if (tryGet(myQueue.DeQueue(), e)) {
        std::cout << "刚刚出队的元素是: " << e << std::endl;
    }
    myQueue.PrintQueue();

    // 6. 再次入队 (测试循环)
    std::cout << "\n--- 测试循环特性 ---" << std::endl;
    for (int v = 40; v <= 100; v += 10) {
        myQueue.EnQueue(v);
    }
    myQueue.PrintQueue();

    // 7. 判满
    std::cout << "队列是否已满? "
              << (myQueue.IsFull() == States::Full ? "是" : "否") << std::endl;

    // 8. 尝试入队 (队列已满，应该失败)
    if (myQueue.EnQueue(110) == States::Full) {
        std::cout << "入队 110 失败：队列已满（符合预期）" << std::endl;
    }

    // 9. 出队 (测试循环)
    if (tryGet(myQueue.DeQueue(), e)) {
        std::cout << "刚刚出队的元素是: " << e << std::endl;
    }
    myQueue.PrintQueue();
    std::cout << "队列是否已满? "
              << (myQueue.IsFull() == States::Full ? "是"
                                                   : "否") // 应该不再满了
              << std::endl;

    // 10. 再次入队 (此时应该成功)
    if (myQueue.EnQueue(110) == States::Success) {
        std::cout << "入队 110 成功" << std::endl;
    }
    myQueue.PrintQueue();

    // 11. 销毁队列
    myQueue.Destroy();
    myQueue.PrintQueue();
    std::cout << "队列是否为空? "
              << (myQueue.IsEmpty() == States::Empty ? "是" : "否")
              << std::endl;
}

auto main() -> int {
    std::cout << "=== 栈测试开始 ===" << std::endl;
    stack_test();
    std::cout << "=== 栈测试结束 ===" << std::endl;
    std::cout << "=== 队列测试开始 ===" << std::endl;
    queue_test();
    std::cout << "=== 队列测试结束 ===" << std::endl;
    return 0;
}
