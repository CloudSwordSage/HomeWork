/*
 * @Time    : 2026/11/24 18:20:46
 * @Author  : 墨烟行(GitHub UserName: CloudSwordSage)
 * @File    : 2026-11-24.cpp
 * @Desc    :
 */

#include <climits>
#include <iostream>
#include <vector>
#include <format>
#include <algorithm>

struct Student {
    int uid;     // 学生ID
    int cid;     // 课程 ID
    float score; // 成绩
    Student(int uid, int cid, float score) : uid(uid), cid(cid), score(score) {
    }
};

struct AvgScore {
    int cid;
    int count;
    float avg;
    AvgScore(int cid, int count, float avg) : cid(cid), count(count), avg(avg) {
    }
    void add(float val) {
        this->count++;
        this->avg += (val - this->avg) / this->count;
    }
};

// 找出成绩最高的学生以及课程
auto maxScore(std::vector<Student> stus) -> void {
    Student maxS(0, 0, 0);
    int max_s = INT_MIN;
    for (Student s : stus) {
        if (s.score > max_s) {
            max_s = s.score;
            maxS = s;
        }
    }
    std::cout << std::format(
        "成绩最高的学生ID是: {}, 其对应的课程是: {}, 成绩是: {}\n",
        maxS.uid,
        maxS.cid,
        maxS.score
    );
}

// 找出不及格的学生以及其各门课的全部成绩
auto failScore(std::vector<Student> stus) -> void {
    std::vector<int> uids;
    for (Student s : stus) {
        auto it = std::find(uids.begin(), uids.end(), s.uid);
        if ((it == uids.end()) && s.score < 60) {
            uids.push_back(s.uid);
        }
    }
    std::cout << "不及格的学生以及其各门课的成绩\n";
    for (Student s : stus) {
        auto it = std::find(uids.begin(), uids.end(), s.uid);
        if (it != uids.end()) {
            std::cout << std::format(
                "学生ID: {}, 课程ID: {}, 成绩: {}({})\n",
                s.uid,
                s.cid,
                s.score,
                s.score > 60 ? "及格" : "不及格"
            );
        }
    }
}

// 求全部学生各门课的平均分数, 并输出
auto avgScore(std::vector<Student> stus) -> void {
    std::vector<AvgScore> avgs;
    for (Student s : stus) {
        auto it = std::find_if(avgs.begin(), avgs.end(), [&](AvgScore a) {
            return a.cid == s.cid;
        });
        if (it == avgs.end()) {
            avgs.emplace_back(s.cid, 1, s.score);
        } else {
            it->add(s.score);
        }
    }
    std::cout << "各门课的平均分数:\n";
    for (AvgScore a : avgs) {
        std::cout << std::format(
            "课程ID: {}, 人数: {}, 平均分: {:.2f}\n",
            a.cid,
            a.count,
            a.avg
        );
    }
}

auto main() -> int {
    std::vector<Student> stus = {
        Student(1, 1, 88), Student(1, 2, 76), Student(1, 3, 92),
        Student(1, 4, 81), Student(2, 1, 65), Student(2, 2, 58),
        Student(2, 3, 72), Student(2, 4, 90), Student(3, 1, 77),
        Student(3, 2, 83), Student(3, 3, 69), Student(3, 4, 74),
        Student(4, 1, 91), Student(4, 2, 47), Student(4, 3, 66),
        Student(4, 4, 85), Student(5, 1, 54), Student(5, 2, 62),
        Student(5, 3, 78), Student(5, 4, 59)
    };
    maxScore(stus);
    failScore(stus);
    avgScore(stus);
    return 0;
}
