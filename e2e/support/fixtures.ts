/** Representative LMS data shaped exactly like the real API responses. */

export const THUMB_KEY = "uploads/course-thumb.png";

const CATEGORY = {
    id: "cat-1",
    categoryId: "cat-1",
    name: "Data & Analytics",
    slug: "data-analytics",
};

export const ENROLMENTS = [
    {
        enrollmentId: "enr-active-recent",
        userId: "user-learner-1",
        courseId: "course-sql",
        status: "ACTIVE",
        enrolledAt: "2026-08-14T09:00:00.000Z",
        accessType: "FULL",
        course: {
            id: "course-sql",
            title: "Applied SQL for Analysts",
            slug: "applied-sql",
            description: "Query, shape and summarise relational data with confidence.",
            thumbnail: THUMB_KEY,
            category: CATEGORY,
        },
    },
    {
        enrollmentId: "enr-active-older",
        userId: "user-learner-1",
        courseId: "course-stats",
        status: "ACTIVE",
        enrolledAt: "2026-05-02T09:00:00.000Z",
        accessType: "FULL",
        course: {
            id: "course-stats",
            title: "Statistics Foundations",
            slug: "statistics-foundations",
            description: "Distributions, sampling and inference for working analysts.",
            thumbnail: null,
            category: CATEGORY,
        },
    },
    {
        enrollmentId: "enr-completed",
        userId: "user-learner-1",
        courseId: "course-viz",
        status: "COMPLETED",
        enrolledAt: "2026-01-20T09:00:00.000Z",
        completedAt: "2026-04-01T09:00:00.000Z",
        accessType: "FULL",
        course: {
            id: "course-viz",
            title: "Data Visualisation Practice",
            slug: "data-visualisation",
            description: "Charts that answer a question rather than decorate a slide.",
            thumbnail: null,
            category: CATEGORY,
        },
    },
    {
        enrollmentId: "enr-revoked",
        userId: "user-learner-1",
        courseId: "course-ml",
        status: "REVOKED",
        enrolledAt: "2026-02-11T09:00:00.000Z",
        accessType: "FULL",
        course: {
            id: "course-ml",
            title: "Machine Learning Primer",
            slug: "ml-primer",
            description: "A grounded introduction to supervised learning.",
            thumbnail: null,
            category: CATEGORY,
        },
    },
    {
        enrollmentId: "enr-section",
        userId: "user-learner-1",
        courseId: "course-excel",
        status: "ACTIVE",
        enrolledAt: "2026-07-03T09:00:00.000Z",
        accessType: "SECTION",
        accessedSections: [
            { sectionId: "sec-a", title: "Pivot tables" },
            { sectionId: "sec-b", title: "Power Query basics" },
            { sectionId: "sec-c", title: "Dashboards" },
            { sectionId: "sec-d", title: "Macros" },
        ],
        course: {
            id: "course-excel",
            title: "Spreadsheet Modelling",
            slug: "spreadsheet-modelling",
            description: "Build models people can audit.",
            thumbnail: null,
            category: CATEGORY,
        },
    },
    {
        enrollmentId: "enr-section-revoked",
        userId: "user-learner-1",
        courseId: "course-audit",
        status: "REVOKED",
        enrolledAt: "2025-12-01T09:00:00.000Z",
        accessType: "SECTION",
        accessedSections: [{ sectionId: "sec-z", title: "Audit trails" }],
        course: {
            id: "course-audit",
            title: "Audit Analytics",
            slug: "audit-analytics",
            description: "Sampling and testing for assurance work.",
            thumbnail: null,
            category: CATEGORY,
        },
    },
];

export function enrolmentsResponse(data = ENROLMENTS) {
    return {
        data,
        pagination: { page: 1, limit: 12, total: data.length, totalPages: 1 },
    };
}

export const COURSE_SQL = {
    courseId: "course-sql",
    title: "Applied SQL for Analysts",
    slug: "applied-sql",
    description: "Query, shape and summarise relational data with confidence.",
    thumbnail: THUMB_KEY,
    price: "249.00",
    currency: "AED",
    status: "PUBLISHED",
    reviewStatus: "APPROVED",
    categoryId: "cat-1",
    instructorId: "inst-1",
    createdAt: "2026-01-05T09:00:00.000Z",
    category: CATEGORY,
    sections: [
        {
            id: "s1",
            sectionId: "s1",
            courseId: "course-sql",
            title: "Getting your bearings",
            order: 1,
            lessons: [
                { id: "l1", lessonId: "l1", sectionId: "s1", title: "Why SQL still wins", order: 1, duration: 480 },
                { id: "l2", lessonId: "l2", sectionId: "s1", title: "Tables, rows and keys", order: 2, duration: 720 },
            ],
        },
        {
            id: "s2",
            sectionId: "s2",
            courseId: "course-sql",
            title: "Shaping results",
            order: 2,
            lessons: [
                { id: "l3", lessonId: "l3", sectionId: "s2", title: "Filtering with WHERE", order: 1, duration: 900 },
                { id: "l4", lessonId: "l4", sectionId: "s2", title: "Grouping and aggregates", order: 2, duration: 1500 },
                { id: "l5", lessonId: "l5", sectionId: "s2", title: "Joins without fear", order: 3, duration: 2100 },
            ],
        },
    ],
};

/** Two of five lessons done: exercises the partial-progress presentation. */
export const PROGRESS_SQL = {
    id: "prog-1",
    userId: "user-learner-1",
    courseId: "course-sql",
    progress: "40",
    timeSpent: 7860,
    lastAccessed: "2026-09-18T16:20:00.000Z",
    updatedAt: "2026-09-18T16:20:00.000Z",
    lessonProgress: [
        { id: "lp1", progressId: "prog-1", lessonId: "l1", completed: true, timeSpent: 480, lastAccessed: "2026-09-10T10:00:00.000Z", updatedAt: "2026-09-10T10:00:00.000Z" },
        { id: "lp2", progressId: "prog-1", lessonId: "l2", completed: true, timeSpent: 700, lastAccessed: "2026-09-12T10:00:00.000Z", updatedAt: "2026-09-12T10:00:00.000Z" },
        { id: "lp3", progressId: "prog-1", lessonId: "l3", completed: false, timeSpent: 240, lastAccessed: "2026-09-18T16:20:00.000Z", updatedAt: "2026-09-18T16:20:00.000Z" },
    ],
};

export const ADMIN_COURSES = [
    {
        courseId: "course-sql",
        title: "Applied SQL for Analysts",
        slug: "applied-sql",
        description: "Query, shape and summarise relational data.",
        price: "249.00",
        currency: "AED",
        status: "PUBLISHED",
        reviewStatus: "APPROVED",
        categoryId: "cat-1",
        instructorId: "inst-1",
        createdAt: "2026-01-05T09:00:00.000Z",
        category: { name: "Data & Analytics", slug: "data-analytics" },
        instructor: { id: "inst-1", email: "rk@example.test", firstName: "Riya", lastName: "Kapoor" },
    },
    {
        courseId: "course-draft",
        title: "Forecasting in Practice",
        slug: "forecasting",
        description: "Time series for planners.",
        price: "199.00",
        currency: "AED",
        status: "DRAFT",
        reviewStatus: "PENDING_REVIEW",
        categoryId: "cat-1",
        instructorId: "inst-2",
        createdAt: "2026-06-22T09:00:00.000Z",
        category: { name: "Data & Analytics", slug: "data-analytics" },
        instructor: { id: "inst-2", email: "sam@example.test", firstName: null, lastName: null },
    },
    {
        courseId: "course-archived",
        title: "Legacy Reporting Tools",
        slug: "legacy-reporting",
        description: "Retired programme.",
        price: "0.00",
        currency: "AED",
        status: "ARCHIVED",
        reviewStatus: "CHANGES_REQUESTED",
        categoryId: "cat-1",
        instructorId: "inst-1",
        createdAt: "2025-11-02T09:00:00.000Z",
        category: undefined,
        instructor: undefined,
    },
];

export function coursesResponse(data = ADMIN_COURSES) {
    return { data, pagination: { page: 1, limit: 20, total: data.length, totalPages: 1 } };
}

export const ADMIN_ENROLMENTS = [
    {
        enrollmentId: "adm-1",
        userId: "user-learner-1",
        courseId: "course-sql",
        status: "ACTIVE",
        enrolledAt: "2026-08-14T09:00:00.000Z",
        user: { id: "user-learner-1", email: "lee@example.test", firstName: "Lee", lastName: "Learner" },
        course: { id: "course-sql", title: "Applied SQL for Analysts", slug: "applied-sql" },
        company: { id: "co-1", name: "Northwind Ltd" },
    },
    {
        enrollmentId: "adm-2",
        userId: "user-learner-2",
        courseId: "course-viz",
        status: "COMPLETED",
        enrolledAt: "2026-03-01T09:00:00.000Z",
        user: { id: "user-learner-2", email: "noname@example.test" },
        course: { id: "course-viz", title: "Data Visualisation Practice", slug: "data-visualisation" },
    },
    {
        enrollmentId: "adm-3",
        userId: "user-learner-3",
        courseId: "course-ml",
        status: "REVOKED",
        enrolledAt: "2026-02-11T09:00:00.000Z",
        user: { id: "user-learner-3", email: "kim@example.test", firstName: "Kim", lastName: "Patel" },
        course: { id: "course-ml", title: "Machine Learning Primer", slug: "ml-primer" },
    },
];

export function adminEnrolmentsResponse(data = ADMIN_ENROLMENTS, overrides = {}) {
    return {
        data,
        pagination: { page: 1, limit: 20, total: data.length, totalPages: 1, ...overrides },
    };
}

export const CATEGORIES = [CATEGORY];

export const ADMIN_USERS = [
    {
        id: "u-1",
        email: "riya@example.test",
        role: "INSTRUCTOR",
        firstName: "Riya",
        lastName: "Kapoor",
        emailVerified: true,
        createdAt: "2026-01-05T09:00:00.000Z",
    },
    {
        id: "u-2",
        email: "nameless@example.test",
        role: "LEARNER",
        firstName: null,
        lastName: null,
        emailVerified: false,
        createdAt: "2026-04-18T09:00:00.000Z",
    },
    {
        id: "u-3",
        email: "ada@example.test",
        role: "PLATFORM_ADMIN",
        firstName: "Ada",
        lastName: "Admin",
        emailVerified: true,
        createdAt: "2025-10-01T09:00:00.000Z",
    },
];

export function usersResponse(data = ADMIN_USERS) {
    return { data, pagination: { page: 1, limit: 20, total: data.length, totalPages: 1 } };
}

export const ADMIN_PAYMENTS = [
    {
        paymentId: "pay_01HXYZ",
        amount: 249,
        currency: "AED",
        gateway: "STRIPE",
        status: "SUCCESS",
        createdAt: "2026-08-14T09:00:00.000Z",
    },
    {
        paymentId: "pay_01HABC",
        amount: 99.5,
        currency: "AED",
        gateway: "RAZORPAY",
        status: "PENDING",
        createdAt: "2026-09-01T09:00:00.000Z",
    },
    {
        paymentId: "pay_01HFAIL",
        amount: 199,
        currency: "AED",
        gateway: "STRIPE",
        status: "FAILED",
        createdAt: "2026-09-10T09:00:00.000Z",
    },
];

export function paymentsResponse(data = ADMIN_PAYMENTS) {
    return { data, pagination: { page: 1, limit: 100, total: data.length, totalPages: 1 } };
}

export const ADMIN_COMPANIES = [
    {
        id: "co-1",
        name: "Northwind Ltd",
        email: "ops@northwind.test",
        phone: "+971 4 000 0000",
        createdAt: "2025-09-15T09:00:00.000Z",
    },
    {
        id: "co-2",
        name: "Contoso FZ",
        email: null,
        phone: null,
        createdAt: "2026-02-02T09:00:00.000Z",
    },
];

/** Catalogue view of a course: priced, partly purchasable by section. */
export const COURSE_CATALOGUE = {
    ...COURSE_SQL,
    compareAtPrice: "399.00",
    learningOutcomes: [
        "Write joins without guessing",
        "Summarise data with GROUP BY",
    ],
    instructor: {
        id: "inst-1",
        email: "riya@example.test",
        firstName: "Riya",
        lastName: "Kapoor",
    },
    accessibleSectionIds: [] as string[],
    sections: [
        { ...COURSE_SQL.sections[0], priceType: "INDIVIDUAL", sectionPrice: "79.00" },
        { ...COURSE_SQL.sections[1], priceType: "INCLUDED", sectionPrice: null },
    ],
};

export const PLATFORM_STATS = {
    totalUsers: 1842,
    totalCourses: 37,
    totalEnrollments: 5104,
};

export const REVENUE_STATS = { total: 412350.5 };

export const ENROLLMENT_STATS = { b2c: 3820, b2b: 1284 };

function trend(days: number, base: number, step: number) {
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.UTC(2026, 7, i + 1)).toISOString().slice(0, 10),
        value: Math.round(base + Math.sin(i / 3) * step + i * 2),
    }));
}

export const ENROLLMENT_TREND = trend(30, 40, 12);
export const REVENUE_TREND = trend(30, 900, 260).map((p) => ({ date: p.date, revenue: p.value }));

export const TOP_COURSES = [
    { courseId: "course-sql", courseTitle: "Applied SQL for Analysts", enrollments: 612 },
    { courseId: "course-viz", courseTitle: "Data Visualisation Practice", enrollments: 488 },
    { courseId: "course-stats", courseTitle: "Statistics Foundations", enrollments: 344 },
    { courseId: "course-excel", courseTitle: "Spreadsheet Modelling", enrollments: 201 },
    { courseId: "course-ml", courseTitle: "Machine Learning Primer", enrollments: 147 },
];

export const ADMIN_CATEGORIES = [
    {
        categoryId: "cat-1",
        name: "Data & Analytics",
        slug: "data-analytics",
        description: null,
        isActive: true,
        displayOrder: 1,
        createdAt: "2025-09-01T09:00:00.000Z",
        updatedAt: "2026-01-01T09:00:00.000Z",
        coursesCount: 12,
    },
    {
        categoryId: "cat-2",
        name: "Retired Topics",
        slug: "retired-topics",
        description: null,
        isActive: false,
        displayOrder: 9,
        createdAt: "2025-03-01T09:00:00.000Z",
        updatedAt: "2025-12-01T09:00:00.000Z",
        coursesCount: 0,
    },
];

export function adminCategoriesResponse(data = ADMIN_CATEGORIES) {
    return { data, pagination: { page: 1, limit: 50, total: data.length, totalPages: 1 } };
}

export const ADMIN_COUPONS = [
    {
        couponId: "cp-1",
        couponCode: "LAUNCH25",
        discountType: "PERCENTAGE",
        discountValue: 25,
        maxDiscountAmount: 100,
        validFrom: "2026-01-01T00:00:00.000Z",
        validTill: "2099-01-01T00:00:00.000Z",
        usageCount: 42,
        usageLimit: 500,
        isActive: true,
        categories: [{ categoryId: "cat-1", name: "Data & Analytics" }],
        courses: [],
    },
    {
        couponId: "cp-2",
        couponCode: "OLDSALE",
        discountType: "FIXED",
        discountValue: 50,
        maxDiscountAmount: null,
        validFrom: "2025-01-01T00:00:00.000Z",
        validTill: "2025-06-01T00:00:00.000Z",
        usageCount: 310,
        usageLimit: null,
        isActive: true,
        categories: [],
        courses: [],
    },
];

export function adminCouponsResponse(data = ADMIN_COUPONS) {
    return { data, pagination: { page: 1, limit: 20, total: data.length, totalPages: 1 } };
}

/** Draft courses, one of which is awaiting review. */
export const MODERATION_COURSES = [
    {
        ...ADMIN_COURSES[1],
        reviewStatus: "PENDING_REVIEW",
        submittedAt: "2026-09-10T09:00:00.000Z",
    },
    { ...ADMIN_COURSES[0], status: "DRAFT", reviewStatus: "APPROVED" },
];

/** Instructor-owned courses, one of each review state. */
export const INSTRUCTOR_COURSES = [
    {
        ...ADMIN_COURSES[0],
        instructorId: "inst-1",
        sections: COURSE_SQL.sections,
    },
    {
        courseId: "course-draft",
        title: "Forecasting in Practice",
        slug: "forecasting",
        description: "Time series for planners.",
        thumbnail: null,
        price: "199.00",
        currency: "AED",
        status: "DRAFT",
        reviewStatus: "CHANGES_REQUESTED",
        reviewNotes: "Please re-record module 2, the audio clips.",
        rejectionReason: null,
        categoryId: "cat-1",
        instructorId: "inst-1",
        createdAt: "2026-06-22T09:00:00.000Z",
        updatedAt: "2026-07-01T09:00:00.000Z",
        sections: [
            {
                id: "fs1",
                sectionId: "fs1",
                courseId: "course-draft",
                title: "Baselines",
                order: 1,
                lessons: [
                    {
                        id: "fl1",
                        lessonId: "fl1",
                        sectionId: "fs1",
                        title: "Naive forecasts",
                        order: 1,
                        duration: 420,
                        type: "VIDEO",
                        status: "READY",
                    },
                    {
                        id: "fl2",
                        lessonId: "fl2",
                        sectionId: "fs1",
                        title: "Reading the residuals",
                        order: 2,
                        duration: 600,
                        type: "TEXT",
                        status: "DRAFT",
                    },
                ],
            },
        ],
    },
    {
        courseId: "course-pending",
        title: "Cohort Analytics",
        slug: "cohort-analytics",
        description: "Retention curves that hold up.",
        thumbnail: null,
        price: "179.00",
        currency: "AED",
        status: "DRAFT",
        reviewStatus: "PENDING_REVIEW",
        categoryId: "cat-1",
        instructorId: "inst-1",
        createdAt: "2026-08-02T09:00:00.000Z",
        updatedAt: "2026-08-02T09:00:00.000Z",
        sections: [],
    },
];

export const INSTRUCTOR_STATS = {
    totalStudents: 1284,
    totalCourses: 3,
    totalRevenue: 84250.75,
    recentCourses: [
        {
            courseId: "course-sql",
            title: "Applied SQL for Analysts",
            status: "PUBLISHED",
            enrollmentCount: 612,
        },
        {
            courseId: "course-draft",
            title: "Forecasting in Practice",
            status: "DRAFT",
            enrollmentCount: 0,
        },
    ],
};

export const COURSE_PERFORMANCE = {
    enrollments: 612,
    completed: 244,
    completionRate: 39.8693,
    averageProgress: 57.4211,
};

export const BLOG_POSTS = [
    {
        id: "post-1",
        slug: "reading-a-query-plan",
        title: "Reading a query plan without fear",
        excerpt: "Start at the leaves and work up.",
        content: "# Reading a query plan",
        author: { id: "inst-1", name: "Riya Kapoor" },
        tags: ["sql"],
        status: "PUBLISHED",
        featured: true,
        publishedAt: "2026-07-01T09:00:00.000Z",
        createdAt: "2026-06-20T09:00:00.000Z",
        updatedAt: "2026-07-01T09:00:00.000Z",
    },
    {
        id: "post-2",
        slug: "draft-notes",
        title: "Notes on sampling",
        excerpt: "Still rough.",
        content: "draft",
        author: { id: "inst-1", name: "Riya Kapoor" },
        tags: [],
        status: "DRAFT",
        featured: false,
        createdAt: "2026-08-11T09:00:00.000Z",
        updatedAt: "2026-08-12T09:00:00.000Z",
    },
];

export function blogsResponse(data = BLOG_POSTS) {
    return { data, pagination: { page: 1, limit: 50, total: data.length, totalPages: 1 } };
}

export const COMPANY_DETAIL = {
    id: "co-1",
    name: "Northwind Ltd",
    email: "ops@northwind.test",
    phone: "+971 4 000 0000",
    address: "Level 12, Emaar Square, Dubai",
    createdAt: "2025-09-15T09:00:00.000Z",
};

export const PROFILE = {
    id: "inst-1",
    email: "riya@example.test",
    role: "INSTRUCTOR",
    firstName: "Riya",
    lastName: "Kapoor",
    emailVerified: true,
};
