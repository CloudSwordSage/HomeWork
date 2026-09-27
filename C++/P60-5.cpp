/*
 * @Time    : 2026/9/27 15:26:24
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : P60-5.cpp
 * @Desc    : P.60 5
 */

#include <iostream>
#include <iomanip>

int main() {
    unsigned short us = 65535;
    us = us + 1;
    std::cout << "  unsigned short:";
    std::cout << std::setw(8) << std::hex << us << "," << std::setw(8)
              << std::dec << us << std::endl;

    signed short ss = 32767;
    ss = ss + 1;
    std::cout << "  signed short:";
    std::cout << std::setw(8) << std::hex << ss << "," << std::setw(8)
              << std::dec << ss << std::endl;
}
