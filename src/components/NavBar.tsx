import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import ImageButton from "./inputs/ImageButton"
import MenuSeparator from "./MenuSeparator"
import { downloadDatabaseAtom } from "../atoms/database"
import ImageLink from "./inputs/ImageLink"
import { RESOURCE } from "../types/user"
export default function NavBar() {
  const {permissions} = useAtomValue(userAtom)
  const permMat = permissions.get(RESOURCE.MATERIALS_DB)
  const permPrice = permissions.get(RESOURCE.PRICES)
  const permSpec = permissions.get(RESOURCE.SPECIFICATION)
  const permUsers = permissions.get(RESOURCE.USERS)
  const permCombi = permissions.get(RESOURCE.COMBIFASADES)
  const permWard = permissions.get(RESOURCE.WARDROBES)
  const downloadDatabase = useSetAtom(downloadDatabaseAtom)
  return <div className="data-navbar">
    {permCombi?.Read && <ImageLink link={"combi"} caption="Комби-фасады" icon="combiButton" />}
    {permWard?.Read && <ImageLink link={"calculator"} caption="Калькулятор шкафов" icon="wardrobeButton" />}
    <>
      <MenuSeparator />
      {permMat?.Read && <ImageLink link={"materials"} caption="База материалов" icon="editMaterials" />}
      {permPrice?.Read && <ImageLink link={"pricelist"} caption="База цен" icon="editPrice" />}
      {permSpec?.Read && <ImageLink link={"specification"} caption="База спецификации" icon="editSpecification" />}
    </>

    {permUsers?.Read &&
      <>
        <MenuSeparator />
      {(permUsers?.Create || permUsers?.Update || permUsers?.Delete) && <ImageLink link={"users"} caption="Список пользователей" icon="userlistButton" />}
      <ImageButton title="Скачать базу данных" caption="Скачать базу данных" icon="downloadButton" onClick={() => { downloadDatabase() }} />
      </>
    }
  </div>
}