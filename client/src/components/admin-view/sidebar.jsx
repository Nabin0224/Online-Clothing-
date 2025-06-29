import { ChartNoAxesCombined } from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { BadgeCheck, LayoutDashboard, ShoppingBasket } from "lucide-react";

export const adminSidebarMeanItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products ",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({setOpen}) {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-col gap-3 mt-8">
      {adminSidebarMeanItems.map((menuItem) => (
        <div
        key={menuItem.id}  
          onClick={() => {
            navigate(menuItem.path)
            setOpen ? setOpen(false) : null
          }}
          className="  text-muted-foreground hover:text-foreground  hover:bg-muted   cursor-pointer flex gap-2 py-4 px-2"
        >
          {menuItem.icon}
          {menuItem.label}
        </div>
      ))}
    </nav>
  );
}

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen} className="">
        <SheetContent side="left">
          <div className="h-full flex flex-col w-64">
            <SheetHeader>
              <SheetTitle className="flex gap-2">
               
                <ChartNoAxesCombined size={30} /> Admin Panel
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen}/>
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 py-6 flex-col border-r bg-background lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-4"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems  />
      </aside>
    </Fragment>
  );
};

export default AdminSidebar;
