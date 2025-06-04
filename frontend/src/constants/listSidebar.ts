interface MenuItems {
  name?: string
  icon?: any
  href?: string
  separator?: boolean
  action?: string
}

import DashboardIcon from '@/assets/img/dashboard.svg'
import OrderListsIcon from '@/assets/img/order-lists.svg'
import ProductStockIcon from '@/assets/img/product-stock.svg'
import ContactIcon from '@/assets/img/contact.svg'
import UiElementsIcon from '@/assets/img/ui-elements.svg'
import TeamIcon from '@/assets/img/team.svg'
import TableIcon from '@/assets/img/table.svg'
import LogoutIcon from '@/assets/img/logout.svg'

export const menuItems: MenuItems[] = [
  { name: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
  { name: 'Quản lý Hộ gia đình', icon: ContactIcon, href: '/households' },
  { name: 'Quản lý Nhân khẩu', icon: TeamIcon, href: '/residents' },
  { name: 'Quản lý Phương tiện', icon: TableIcon, href: '/vehicles' },
  { separator: true },
  { name: 'Quản lý Khoản thu', icon: UiElementsIcon, href: '' },
  { name: 'Quản lý Đợt thu', icon: ProductStockIcon, href: '' },
  { name: 'Quản lý Các loại phí', icon: ProductStockIcon, href: '' },
  { separator: true },
  { name: 'Đăng xuất', icon: LogoutIcon, action: 'logout' },
]
