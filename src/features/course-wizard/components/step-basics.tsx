"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCreateCourse, useUpdateCourse } from "@/features/courses/hooks/use-courses";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useCourseWizard } from "../store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { SecureImage } from "@/components/ui/secure-image";
import { useEffect } from "react";

const basicsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  level: z
    .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"])
    .default("BEGINNER"),
  language: z
    .string({
      required_error: "Language is required",
    })
    .min(1, "Language is required")
    .default("English"),
  thumbnail: z
    .string()
    .min(1, "Thumbnail is required")
    .optional()
    .or(z.literal(""))
    .transform((val) => val === "" ? undefined : val),
});

type BasicsFormData = z.infer<typeof basicsSchema>;

export function StepBasics() {
  const { nextStep, setCourseId, setCourseTitle, courseId, currentStep } = useCourseWizard();
  
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BasicsFormData>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      language: "English",
      level: "BEGINNER",
    },
  });

  const thumbnail = watch("thumbnail");

  const onSubmit = async (data: BasicsFormData) => {
    try {
      if (!courseId) {
        const result = await createCourse.mutateAsync({
          title: data.title,
          description: data.description,
          shortDescription: data.description,
          categoryId: data.categoryId,
          price: 0,
          currency: "USD",
          status: "DRAFT",
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          level: data.level,
          language: data.language,
          thumbnail: data.thumbnail,
        });
        setCourseId(result.courseId);
        setCourseTitle(result.title);
        toast.success("Course draft started!");
      } else {
        await updateCourse.mutateAsync({
          id: courseId,
          dto: {
            title: data.title,
            description: data.description,
            shortDescription: data.description,
            categoryId: data.categoryId,
            slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            level: data.level,
            language: data.language,
            thumbnail: data.thumbnail,
          },
        });
        setCourseTitle(data.title);
        toast.success("Course basics updated!");
      }
      nextStep();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save course basics.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-10">
         <h2 className="text-3xl font-bold tracking-tight">Course Essentials</h2>
         <p className="text-muted-foreground text-lg">Every great course starts with a name and a mission.</p>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            {/* Title Section */}
            <div className="space-y-3">
               <Label className="text-lg font-semibold">What is the title of your course?</Label>
               <Input
                 placeholder="e.g. The Complete Financial Analyst Course 2024"
                 {...register("title")}
                 className="text-2xl md:text-3xl h-16 px-6 font-bold bg-transparent border-0 border-b-2 border-input rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors placeholder:text-muted-foreground/30"
               />
               {errors.title?.message && <p className="text-destructive text-sm mt-2">{errors.title.message}</p>}
               <p className="text-sm text-muted-foreground">It's okay if you can't think of a good title now. You can change it later.</p>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
               <Label className="text-base font-semibold">What is this course about?</Label>
               <Textarea
                 placeholder="Describe the key value of your course in a few sentences."
                 rows={4}
                 {...register("description")}
                 className="resize-none text-base p-4 bg-muted/20 border-muted-foreground/20 focus-visible:bg-background transition-colors"
               />
                {errors.description?.message && <p className="text-destructive text-sm">{errors.description.message}</p>}
            </div>

            <div className="grid gap-12 md:grid-cols-2">
               {/* Metadata Column */}
               <div className="space-y-6">
                 <FormField
                    label="Category"
                    required
                    error={errors.categoryId?.message}
                  >
                    <Controller
                      control={control}
                      name="categoryId"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.categoryId} value={cat.categoryId}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>

                  <FormField label="Level" required error={errors.level?.message}>
                    <Controller
                       control={control}
                       name="level"
                       render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                            <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                          </SelectContent>
                        </Select>
                       )}
                    />
                  </FormField>

                   <FormField label="Language" required error={errors.language?.message}>
                    <Controller
                      control={control}
                      name="language"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
               </div>
               
               {/* Thumbnail Column */}
               <div className="space-y-3">
                   <Label className="text-base font-semibold">Course Thumbnail</Label>
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 hover:bg-muted/10 transition-colors">
                         <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-4 shadow-inner flex items-center justify-center">
                            {thumbnail ? (
                                <SecureImage src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-muted-foreground text-sm">No image selected</span>
                            )}
                         </div>
                         <FileUpload 
                            onUploadComplete={(key) => {
                              setValue("thumbnail", key, { shouldDirty: true, shouldValidate: true });
                            }} 
                            folder="thumbnails"
                            label="Select Image"
                            className="w-full"
                         />
                    </div>
                     {errors.thumbnail && <p className="text-sm text-destructive mt-1">{errors.thumbnail.message}</p>}
               </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 h-12 text-lg rounded-full"
                disabled={createCourse.isPending || updateCourse.isPending}
              >
                {createCourse.isPending || updateCourse.isPending ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
