export function getMenuNameFlag(menuList, menuName) {
  let show = false;
  menuList?.forEach((element) => {
    if (element.menuName === menuName) {
      show = element.show;
    }
  });
  return show;
}
