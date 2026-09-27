/*
 * @Time    : 2026/9/27 15:37:49
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : P60-6.cpp
 * @Desc    : P.60 6
 */
#include <iostream>

int main() {
    unsigned int k;
    char x = 'A';
    double a = 9.0;
    int y = 2, z = 1;
    k = x + (int)((int)a % 3 * (float)(x + y)) % 2 / z;
    std::cout << k << std::endl;

    // double u;
    // int i = 2;
    // float a = 4;
    // std::cout << "i = " << i << ", a = " << a << "\n";
    // u = i--;
    // std::cout << "(u = i--后) i = " << i << ", a = " << a << ", u = " << u
    //           << "\n";
    // a *= ++i;
    // std::cout << "(a *= ++i后) i = " << i << ", a = " << a << ", u = " << u
    //           << std::endl;
}
