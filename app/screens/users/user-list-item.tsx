import React from "react"
import styled from "styled-components/native"
import { FlexContainer, Text } from "../../components"
import { color, spacing } from "../../theme"
import { UserProfile } from "../../models"
import { UserRoleEnum } from "../../types"

const StyledUserListItem = styled.TouchableOpacity<{ bgColor?: string }>`
  padding: ${spacing[4]}px ${spacing[2]}px;
  border-bottom-color: ${color.palette.grey3};
  border-bottom-width: 1px;
  background-color: ${({ bgColor }) => bgColor || color.palette.white};
`

export const RoleBadge = styled(Text)<{ color?: string }>`
  padding: ${spacing[2]}px ${spacing[2]}px;
  color: ${({ color: _color }) => _color || color.palette.grey3};
  font-size: 12px;
  text-transform: uppercase;
`

export const mapRoleToColor = new Map<UserRoleEnum, string>([
  [UserRoleEnum.REQUESTER, color.palette.lightBlue],
  [UserRoleEnum.ADMIN, color.palette.lightRed],
  [UserRoleEnum.CHAPERONE, color.palette.lightGreen],
])

export const UserListItem = ({ item }: { item: UserProfile }) => (
  <StyledUserListItem>
    <FlexContainer>
      <Text preset={["header", "bold"]}>
        {item.firstName} {item.lastName}
      </Text>
    </FlexContainer>
    <Text>Created: {item.createdAt}</Text>
    <Text>Last login at: {item.lastLoginAt}</Text>
  </StyledUserListItem>
)
