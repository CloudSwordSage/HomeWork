#include <iostream>

auto func1(int n) -> double {
    if (n < 2) {
        throw std::invalid_argument("n 必须大于等于 2");
    }
    if (n == 2) {
        return 0.5;
    }
    return func1(n - 1) + 1.0 / (n * (n - 1));
}

auto func2(int n) -> double {
    if (n < 0) {
        throw std::invalid_argument("n 必须大于等于 0");
    }
    if (n == 0) {
        return 1;
    }
    return 1.0 + func2(n - 1) / 7.0;
}

auto func3(int n) -> double {
    if (n < 1) {
        throw std::invalid_argument("n 必须大于等于 1");
    }

    if (n == 1) {
        return 1.0;
    }

    return func3(n - 1) + 1.0 / (2 * n - 1);
}

auto func4(int n) -> double {
    if (n < 1) {
        throw std::invalid_argument("n 必须大于等于 1");
    }

    if (n == 1) {
        return 1.0;
    }

    double sign = (n % 2 == 0) ? -1.0 : 1.0;
    return func4(n - 1) + sign / (3 * n - 2);
}

auto main() -> int {
    std::cout << func1(3) << std::endl; // 实际计算 n - 1 项
    std::cout << func2(3) << std::endl; // 实际计算 n + 1 项
    std::cout << func3(3) << std::endl; // 实际计算 n 项
    std::cout << func4(3) << std::endl; // 实际计算 n 项
}
