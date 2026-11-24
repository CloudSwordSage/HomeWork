/*
 * @Time    : 2026/11/24 19:24:48
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : capacity_test.cpp
 * @Desc    :
 */
#include <iostream>
#include <vector>

int main() {
    bool flag = false;
    for (std::size_t i = 1; i <= 1000000; ++i) {
        {
            std::vector<int> tmp;
            tmp.reserve(i);
            if (i != tmp.capacity()) {
                flag = true;
                std::cout << "请求分配: " << i
                          << ", 实际分配: " << tmp.capacity() << std::endl;
            }
        } // 确保tmp释放, 防止干扰实验
    }
    if (!flag) {
        std::cout << "完全匹配" << std::endl;
    }
}
