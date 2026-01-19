import { CLASS_CATEGORY } from "@/constants/category.constant";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui";


function AppSidebar(){
    return <aside className="min-w-full sm:min-w-60 w-full sm:w-60 flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                {/*  Shadcn Ui의 Typography h4 컴포넌트 그대로 사용 */}
                <h4 className="scroll-m-20 text-base sm:text-lg lg:text-xl font-semibold tracking-tight">카테고리</h4>
                <ChevronDown className="mt-1 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full  flex flex-col gap-1 sm:gap-2">
                {CLASS_CATEGORY.map((menu) => {
                  return (
                    <Button key={menu.id} variant={"ghost"} className="justify-start text-xs sm:text-sm text-muted-foreground hover:text-white hover:pl-4 sm:hover:pl-6 transition-all duration-500">
                      {menu.icon}
                      {menu.label}
                    </Button>
                    )
                })}
              </div>
            </aside>
}

export {AppSidebar};