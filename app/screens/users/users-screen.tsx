import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, SectionList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Header, Screen, Text } from "../../components"
import { color, globalStyles, spacing } from "../../theme"
import { UserProfile, useStores } from "../../models"
import { UserListItem } from "./user-list-item"
import styled from "styled-components/native"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const SectionHeader = styled(Text)<{ color?: string }>`
  margin-vertical: ${spacing[2]}px;
  color: ${({ color: _color }) => _color || color.palette.grey3};
  font-size: 12px;
  text-transform: uppercase;
`

const mapRoleSectionTitleToColor = new Map<string, string>([
  ["Requesters", color.palette.darkBlue],
  ["Admins", color.palette.darkRed],
  ["Chaperones", color.palette.darkGreen],
])

export const UsersScreen = observer(function UsersScreen() {
  const [refreshing, setRefreshing] = React.useState(false)
  const { usersStore } = useStores()
  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    usersStore.fetch().then(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    usersStore.fetch()
  }, [])

  const sectionedUserData = usersStore.viewAsSectionByRole
  const sectionData: { title: string; data: UserProfile[] }[] = [
    { title: "Requesters", data: sectionedUserData.REQUESTER },
    { title: "Chaperones", data: sectionedUserData.CHAPERONE },
    { title: "Admins", data: sectionedUserData.ADMIN },
  ]

  return (
    <View testID="UsersScreen" style={globalStyles.full}>
      <Screen style={{ ...globalStyles.root, ...ROOT }} preset="fixed">
        <Header
          headerTx="usersScreen.title"
          leftIcon="back"
          onLeftPress={navigateBack}
          style={globalStyles.header}
        />
        <SectionList<UserProfile>
          sections={sectionData}
          keyExtractor={(user) => user.id}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader preset={["smallHeader"]} color={mapRoleSectionTitleToColor.get(title)}>
              {title}
            </SectionHeader>
          )}
          renderItem={UserListItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </Screen>
    </View>
  )
})
