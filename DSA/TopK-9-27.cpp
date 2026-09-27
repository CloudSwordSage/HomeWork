/*
 * @Time    : 2026/9/27 14:21:43
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : TopK-9-27.cpp
 * @Desc    : 9.27 做, Top K问题
 */

/*
原始题目:
现在有一个整形数组, 数组中元素不重复, 设计一个算法
找到该数组中第二大的值, 并返回下标
要求时间复杂度和空间复杂度仅可能的低
输入: 19, 21, 22, 23, 65, 9, 64, 77, 70, 83, 1, 25
输出: res=77, loc=7

此次实现扩展为Top K
*/

#include <iostream>
#include <tuple>
#include <vector>

using Item = std::tuple<int, int>; // (值, 下标)

// 取元素的值部分
inline int Value(const Item & item) {
    return std::get<0>(item);
}

// 交换两个元素
inline void Swap(Item & a, Item & b) {
    Item tmp = a;
    a = b;
    b = tmp;
}

// 在升序数组 ordered 中二分查找第一个值 >= value 的位置
int LowerBound(const std::vector<Item> & ordered, int value) {
    int left = 0, right = static_cast<int>(ordered.size());
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (Value(ordered[mid]) < value) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

// 最小堆上浮
void SiftUp(std::vector<Item> & heap, int idx) {
    while (idx > 0) {
        int parent = (idx - 1) / 2;
        // 如果父亲比自己大, 则交换位置
        if (Value(heap[parent]) <= Value(heap[idx])) {
            break;
        }
        Swap(heap[parent], heap[idx]);
        idx = parent;
    }
}

// 最小堆下沉
void SiftDown(std::vector<Item> & heap, int idx) {
    int size = static_cast<int>(heap.size());
    while (true) {
        int left = idx * 2 + 1;
        int right = idx * 2 + 2;
        int smallest = idx;

        // 和比自己小的儿子换个位置, 确保儿子比自己大
        if (left < size && Value(heap[left]) < Value(heap[smallest])) {
            smallest = left;
        }
        if (right < size && Value(heap[right]) < Value(heap[smallest])) {
            smallest = right;
        }
        if (smallest == idx) {
            break;
        }

        Swap(heap[idx], heap[smallest]);
        idx = smallest;
    }
}

/**
 * @brief 基于有序数组的 Top K 问题解答  O(nk)
 *
 * 空间复杂度: O(K)
 * 时间复杂度: O(N * K)
 */
std::tuple<int, int> SortArray(const std::vector<int> & nums, int k) {
    int n = static_cast<int>(nums.size());
    if (k <= 0 || k > n) {
        return std::make_tuple(-1, -1);
    }

    std::vector<Item> ordered;
    ordered.reserve(k);

    for (int i = 0; i < n; ++i) {
        int num = nums[i];
        Item item = std::make_tuple(num, i);

        if (static_cast<int>(ordered.size()) < k) {
            ordered.insert(ordered.begin() + LowerBound(ordered, num), item);
        } else if (num > Value(ordered[0])) {
            ordered.erase(ordered.begin());
            ordered.insert(ordered.begin() + LowerBound(ordered, num), item);
        }
    }

    return ordered[0]; // 第 K 大的元素位于升序序列的开头
}

/**
 * @brief 基于最小堆的 Top K 问题解答  O(n log k)
 *
 * 空间复杂度: O(K)
 * 时间复杂度: O(N log K)
 */
std::tuple<int, int> MinHeap(const std::vector<int> & nums, int k) {
    int n = static_cast<int>(nums.size());
    if (k <= 0 || k > n) {
        return std::make_tuple(-1, -1);
    }

    std::vector<Item> heap;
    heap.reserve(k);

    for (int i = 0; i < n; ++i) {
        int num = nums[i];
        Item item = std::make_tuple(num, i);

        if (static_cast<int>(heap.size()) < k) {
            heap.push_back(item);
            SiftUp(heap, static_cast<int>(heap.size()) - 1);
        } else if (num > Value(heap[0])) {
            heap[0] = item;
            SiftDown(heap, 0);
        }
    }

    return heap[0]; // 堆顶即为第 K 大元素
}

int main() {
    std::vector<int> nums = {19, 21, 22, 23, 65, 9, 64, 77, 70, 83, 1, 25};
    int k = 2;

    auto r1 = SortArray(nums, k);
    auto r2 = MinHeap(nums, k);

    std::cout << "SortArray: res=" << std::get<0>(r1)
              << ", loc=" << std::get<1>(r1) << std::endl;

    std::cout << "MinHeap:   res=" << std::get<0>(r2)
              << ", loc=" << std::get<1>(r2) << std::endl;

    return 0;
}
