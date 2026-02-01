"use client";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCreateCategory, useUpdateCategory } from "./hooks";
import type { AdminCategory } from "./types";
const schema = z.object({
    name: z.string().min(2, "Name is required").max(80),
    slug: z.string().min(2).max(80).optional().or(z.literal("")),
    description: z.string().max(500).optional().or(z.literal("")),
    displayOrder: z.coerce.number().min(0).default(0),
    isActive: z.boolean().default(true),
});
type Values = z.infer<typeof schema>;
export function CategoryFormDialog(props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: AdminCategory | null;
}) {
    const isEditing = !!props.category;
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            displayOrder: 0,
            isActive: true,
        },
    });
    useEffect(() => {
        if (props.category) {
            form.reset({
                name: props.category.name,
                slug: props.category.slug,
                description: props.category.description || "",
                displayOrder: props.category.displayOrder ?? 0,
                isActive: props.category.isActive,
            });
        }
        else {
            form.reset({
                name: "",
                slug: "",
                description: "",
                displayOrder: 0,
                isActive: true,
            });
        }
    }, [props.category, form]);
    const isPending = createCategory.isPending || updateCategory.isPending;
    const onSubmit = async (values: Values) => {
        const payload = {
            name: values.name,
            slug: values.slug?.trim() ? values.slug.trim() : undefined,
            description: values.description?.trim() ? values.description.trim() : undefined,
            displayOrder: values.displayOrder,
            isActive: values.isActive,
        };
        if (isEditing && props.category) {
            await updateCategory.mutateAsync({ categoryId: props.category.categoryId, dto: payload });
        }
        else {
            await createCategory.mutateAsync(payload);
        }
        props.onOpenChange(false);
    };
    return (<Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Create Category"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Forex Trading"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="slug" render={({ field }) => (<FormItem>
                  <FormLabel>Slug (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="forex-trading"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="description" render={({ field }) => (<FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Shown in listings (optional)"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="displayOrder" render={({ field }) => (<FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="isActive" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <p className="text-sm text-muted-foreground">Enable this category for selection and filtering</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                </FormItem>)}/>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>);
}
