'use client';

import { Box, CalendarIcon, House } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Header from '@/components/header';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { newDeliveryNoteSchema } from '../schemas/delivery-notes';
import ItemsTable from './components/items-table';

export default function NewDeliveryNotePage() {
	const newDeliveryNote = useForm<z.infer<typeof newDeliveryNoteSchema>>({
		resolver: zodResolver(newDeliveryNoteSchema),
		defaultValues: {
			items: [
				{
					id: uuidv4(),
					description: 'Guantes de nitrilo talla M',
					delivered_quantity: 0,
					item_name: 'Guante de nitrilo',
					item_code: 'GN-001',
				},
			],
		},
	});

	const onSubmit = (data: z.infer<typeof newDeliveryNoteSchema>) => {
		console.log(data);
	};

	return (
		<Form {...newDeliveryNote}>
			<Header title="Nuevo remito">
				<div className="flex justify-end gap-2 ml-auto">
					<Button
						type="button"
						variant="ghost"
						size="sm"
					>
						Previsualizar
					</Button>
					<Button
						type="submit"
						onClick={newDeliveryNote.handleSubmit(onSubmit)}
						size="sm"
					>
						Crear remito
					</Button>
				</div>
			</Header>
			<Tabs
				className="mt-4"
				defaultValue="tab-1"
			>
				<ScrollArea>
					<TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
						<TabsTrigger
							value="tab-1"
							className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
						>
							<House
								className="-ms-0.5 me-1.5"
								size={16}
								aria-hidden="true"
							/>
							General
						</TabsTrigger>
						<TabsTrigger
							value="tab-2"
							className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
						>
							<Box
								className="-ms-0.5 me-1.5"
								size={16}
								aria-hidden="true"
							/>
							Otros
						</TabsTrigger>
					</TabsList>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
				<TabsContent value="tab-1">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
						<FormField
							control={newDeliveryNote.control}
							name="purchase_order"
							render={({ field }) => (
								<FormItem className="flex flex-col w-full">
									<FormLabel className="w-fit">
										Número de orden de venta
									</FormLabel>
									<FormControl>
										<Input
											placeholder="432000003"
											{...field}
										/>
									</FormControl>
									{newDeliveryNote.formState.errors
										.purchase_order ? (
										<FormMessage>
											{
												newDeliveryNote.formState.errors
													.purchase_order.message
											}
										</FormMessage>
									) : (
										<FormDescription>
											Esta será la orden de venta a la que se asociará el remito.
										</FormDescription>
									)}
								</FormItem>
							)}
						/>
						<FormField
							control={newDeliveryNote.control}
							name="delivered_at"
							render={({ field }) => (
								<FormItem className="flex flex-col w-full">
									<FormLabel className="w-fit">
										Fecha de entrega
									</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={'outline'}
													className={cn(
														'w-full pl-3 text-left font-normal',
														!field.value &&
														'text-muted-foreground'
													)}
												>
													{field.value ? (
														format(
															field.value,
															'PPP'
														)
													) : (
														<span>
															Seleccioná una fecha
														</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
										>
											<Calendar
												mode="single"
												selected={
													field.value
														? new Date(field.value)
														: undefined
												}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									{newDeliveryNote.formState.errors
										.delivered_at ? (
										<FormMessage>
											{
												newDeliveryNote.formState.errors
													.delivered_at.message
											}
										</FormMessage>
									) : (
										<FormDescription>
											Esta será la fecha en la que se
											entregó el pedido.
										</FormDescription>
									)}
								</FormItem>
							)}
						/>
						<FormField
							control={newDeliveryNote.control}
							name="notes"
							render={({ field }) => (
								<FormItem className="flex flex-col w-full md:col-span-2">
									<FormLabel className="w-fit">
										Notas
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Notas..."
											className="resize-none"
										/>
									</FormControl>
									<FormDescription>
										Estas notas serán visibles en el
										remito.
									</FormDescription>
								</FormItem>
							)}
						/>
						<ItemsTable className="col-span-2" />
					</div>
				</TabsContent>
				<TabsContent value="tab-2">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4"></div>
				</TabsContent>
			</Tabs>
		</Form>
	);
}
