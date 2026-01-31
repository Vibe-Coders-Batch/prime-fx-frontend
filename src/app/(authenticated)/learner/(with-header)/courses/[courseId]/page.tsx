"use client";
import { use } from "react";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, Clock, User, CheckCircle2, Video, FileText, Download, Smartphone, Award, Star, ShoppingCart, Lock, Check, } from "lucide-react";
import { useCheckEnrollment, useCreateEnrollment } from "@/features/enrollments/hooks/use-enrollments";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { useCreatePayment } from "@/features/payments/hooks/use-payments";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CourseHeroBackground } from "@/components/course/course-hero-background";
export default function CourseDetailPage({ params, }: {
    params: Promise<{
        courseId: string;
    }>;
}) {
    const { courseId } = use(params);
    const { data: course, isLoading, error } = useCourse({ enabled: true, courseId });
    const createEnrollment = useCreateEnrollment();
    const createPayment = useCreatePayment();
    const addToCart = useAddToCart();
    const { user } = useAuthStore();
    const router = useRouter();
    const { data: checkData } = useCheckEnrollment({ enabled: !!user, courseId });
    const isAdmin = user?.role === 'PLATFORM_ADMIN';
    const isEnrolled = !!checkData?.isEnrolled || isAdmin;
    const handleBuyNow = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (course && parseFloat(course.price) > 0) {
            const courseIdValue = course.courseId;
            const payment = await createPayment.mutateAsync({
                gateway: "STRIPE_US",
                itemType: "COURSE",
                courseId: courseIdValue,
                successUrl: `${window.location.origin}/learner/payment/success?courseId=${courseIdValue}`,
                cancelUrl: `${window.location.origin}/learner/payment/failure`,
            });
            if (payment.checkoutUrl) {
                window.location.href = payment.checkoutUrl;
            }
            else {
                router.push(`/learner/payment/success?paymentId=${payment.paymentId}`);
            }
            return;
        }
        try {
            await createEnrollment.mutateAsync({ courseId });
            router.push(`/learner/courses/${courseId}/watch`);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Enrollment error:", error.message);
            }
        }
    };
    const handleAddToCart = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!course)
            return;
        try {
            await addToCart.mutateAsync({ itemType: "COURSE", courseId: course.courseId });
            router.push("/learner/cart");
        }
        catch (error) {
        }
    };
    if (isLoading) {
        return (<div className="min-h-screen bg-background px-6 pb-6 space-y-6 mx-auto">
        <div className="border-b border-border space-y-4 pb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20"/>
            <Skeleton className="h-6 w-24"/>
          </div>
          <Skeleton className="h-10 w-3/4"/>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-16"/>
            <Skeleton className="h-5 w-24"/>
            <Skeleton className="h-5 w-28"/>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="aspect-video w-full rounded-lg"/>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48"/>
              <div className="grid md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (<div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full"/>
                    <Skeleton className="h-4 w-full"/>
                  </div>))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48"/>
              <div className="grid md:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5"/>
                    <Skeleton className="h-4 w-40"/>
                  </div>))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-40"/>
              <div className="space-y-4">
                {[1, 2].map((i) => (<div key={i} className="border rounded-lg p-4 space-y-3">
                    <Skeleton className="h-6 w-48"/>
                    <Skeleton className="h-4 w-full"/>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (<div key={j} className="flex items-center gap-3">
                          <Skeleton className="h-4 w-6"/>
                          <Skeleton className="h-4 w-full"/>
                          <Skeleton className="h-4 w-12"/>
                        </div>))}
                    </div>
                  </div>))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-20 h-fit">
            <div className="border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex border-b">
                <Skeleton className="h-10 w-20"/>
                <Skeleton className="h-10 w-20"/>
              </div>
              <Skeleton className="h-4 w-full"/>
              <div className="space-y-2">
                <Skeleton className="h-10 w-32"/>
                <Skeleton className="h-4 w-24"/>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full"/>
                <Skeleton className="h-12 w-full"/>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40"/>
                <Skeleton className="h-4 w-32"/>
              </div>
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16"/>
                  <Skeleton className="h-4 w-16"/>
                  <Skeleton className="h-4 w-20"/>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20"/>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1"/>
                    <Skeleton className="h-9 w-20"/>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48"/>
                <Skeleton className="h-12 w-full"/>
                <Skeleton className="h-4 w-40"/>
              </div>
            </div>
          </div>
        </div>
      </div>);
    }
    if (error || !course) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState title="Course not found" description="The course you're looking for doesn't exist or has been removed." icon={<BookOpen className="h-12 w-12"/>}/>
      </div>);
    }
    const totalDuration = course.sections?.reduce((acc, section) => acc +
        (section.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0), 0) || 0;
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };
    const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
    const originalPrice = parseFloat(course.price) * 1.5;
    const discount = Math.round(((originalPrice - parseFloat(course.price)) / originalPrice) * 100);
    return (<div className="min-h-screen bg-background">
      
      <CourseHeroBackground course={course} className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12"/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        <div className="flex items-center gap-4 text-sm flex-wrap border-b border-border pb-6">
          <Badge className="bg-blue-600 text-white hover:bg-blue-700">Bestseller</Badge>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground">4.6</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
          </div>
          <span className="text-muted-foreground">(1,234 ratings)</span>
          <span className="text-muted-foreground">12,345 students</span>
          <span className="text-muted-foreground">
            {formatDuration(totalDuration)} total
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">

          
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (<div className="bg-muted/30 rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((objective, idx) => (<div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5"/>
                    <span className="text-sm text-foreground">{objective}</span>
                  </div>))}
              </div>
            </div>)}

          

          
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">This course includes:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0"/>
                <span className="text-sm text-foreground">{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary shrink-0"/>
                <span className="text-sm text-foreground">Access on mobile and TV</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0"/>
                <span className="text-sm text-foreground">Full lifetime access</span>
              </div>
            </div>
          </div>

          
          <div>
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.sections?.map((section, idx) => {
            const isSectionAccessible = course.accessibleSectionIds?.includes(section.sectionId);
            const canPurchaseSeparately = section.priceType === "INDIVIDUAL" || section.priceType === "BOTH";
            const sectionPrice = section.sectionPrice ? parseFloat(section.sectionPrice) : 0;
            return (<div key={section.sectionId} className="border rounded-lg p-5 bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        Section {idx + 1}: {section.title}
                      </h3>
                      {!isEnrolled && canPurchaseSeparately && sectionPrice > 0 && (<div className="flex items-center gap-2">
                          {isSectionAccessible ? (<Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <Check className="h-3 w-3 mr-1"/>
                              Owned
                            </Badge>) : (<>
                              <span className="text-sm font-semibold text-primary">
                                {course.currency} {sectionPrice.toFixed(2)}
                              </span>
                              <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={async () => {
                            if (!user) {
                                router.push("/login");
                                return;
                            }
                            try {
                                await addToCart.mutateAsync({
                                    itemType: "SECTION",
                                    sectionId: section.sectionId,
                                });
                                toast.success("Section added to cart");
                            }
                            catch (error: any) {
                                toast.error(error.response?.data?.message || "Failed to add to cart");
                            }
                        }}>
                                <ShoppingCart className="h-3.5 w-3.5 mr-1"/>
                                Buy Section
                              </Button>
                            </>)}
                        </div>)}
                    </div>
                    {section.description && (<p className="text-sm text-muted-foreground mb-4">
                        {section.description}
                      </p>)}
                    <div className="space-y-2.5">
                      {section.lessons?.map((lesson, lessonIdx) => (<div key={lesson.lessonId} className={cn("flex items-center gap-3 text-sm py-2 px-3 rounded-md transition-colors", isSectionAccessible || isEnrolled
                        ? "hover:bg-muted/50"
                        : "opacity-60")}>
                          <span className="w-6 text-center font-medium text-muted-foreground">{lessonIdx + 1}</span>
                          <span className="flex-1 text-foreground flex items-center gap-2">
                            {lesson.title}
                            {!isSectionAccessible && !isEnrolled && (<Lock className="h-3.5 w-3.5 text-muted-foreground"/>)}
                          </span>
                          {lesson.duration && (<span className="text-xs text-muted-foreground font-medium">
                              {formatDuration(lesson.duration)}
                            </span>)}
                        </div>))}
                    </div>
                  </div>);
        })}
            </div>
          </div>

          
          {course.instructor && (<div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Instructor</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <User className="h-8 w-8 text-primary"/>
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor.email}
                  </p>
                </div>
              </div>
            </div>)}
        </div>

        
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="border rounded-lg p-6 space-y-5 bg-card shadow-sm">
            
            <div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-foreground">
                  {course.currency} {parseFloat(course.price).toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {course.currency} {originalPrice.toFixed(2)}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {discount}% off
                </Badge>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5"/>
                23 hours left at this price!
              </p>
            </div>

            
            
            <div className="space-y-3">
                {isEnrolled ? (<Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" onClick={() => router.push(`/learner/courses/${courseId}/watch`)}>
                    Go to Course
                  </Button>) : (<>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" onClick={handleAddToCart}>
                      Add to cart
                    </Button>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" size="lg" onClick={handleBuyNow} disabled={createEnrollment.isPending || createPayment.isPending}>
                      {createEnrollment.isPending || createPayment.isPending
                ? "Processing..."
                : "Buy now"}
                    </Button>
                  </>)}
            </div>

            
            <div className="text-sm text-muted-foreground space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0"/>
                <p>30-Day Money-Back Guarantee</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0"/>
                <p>Full Lifetime Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>);
}
