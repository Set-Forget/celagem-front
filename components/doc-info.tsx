import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Link } from "lucide-react";
import { useState } from "react";

export default function DocumentInfo<T>({
  fields,
  isLoading,
  data,
  title,
}: {
  fields: FieldDefinition<T>[]
  isLoading: boolean
  data: T | undefined
  title: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-sm">
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn("bg-indigo-50/50 select-none rounded-sm flex items-center justify-between p-4 py-2 cursor-pointer hover:bg-indigo-50/50 transition-all duration-200 shadow-lg shadow-indigo-50/50 hover:shadow-md hover:shadow-indigo-50/50 border border-b-0 border-transparent", isExpanded && "rounded-b-none border-indigo-100 !shadow-none")}
        initial={false}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2">
          <Link className="h-3.5 w-3.5 text-indigo-800" />
          <span className="text-xs text-indigo-800 font-medium">{title}</span>
        </div>
        <motion.div
          initial={false}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ChevronDown className="h-3.5 w-3.5 text-indigo-800" />
        </motion.div>
      </motion.div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.2, ease: "easeOut" },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.2, ease: "easeOut" },
                opacity: { duration: 0.2 },
              },
            }}
            className="ring-inset ring-1 ring-border rounded-b-sm shadow-md shadow-border/50"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
              {fields.map((field) => {
                const displayValue = isLoading ? placeholder(field?.placeholderLength ?? 10) : (field.render(data!) ?? "")
                return (
                  <div
                    className={cn("flex flex-col gap-1", field.className)}
                    key={typeof field.label === "function" ? field.label.name || "function-label" : field.label}
                  >
                    <label className="text-muted-foreground text-xs">
                      {typeof field.label === "function" ? field.label(data!) : field.label}
                    </label>
                    <motion.span
                      className={cn("text-sm", isLoading ? "blur-[4px]" : "blur-none")}
                      initial={false}
                      animate={{
                        filter: isLoading ? "blur(4px)" : "blur(0px)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {displayValue}
                    </motion.span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
