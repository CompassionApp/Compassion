import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components/native"
import { Button, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, typography } from "../../theme"

const BORDER_RADIUS = 5

const Container = styled.View`
  background-color: ${color.palette.white};
  border-radius: ${BORDER_RADIUS};
  margin-vertical: 5;
`

const Content = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-vertical: 3;
`

const Title = styled(Text)`
  font-size: 22;
  font-family: ${typography.secondary};
  text-align: center;
  padding-vertical: 5;
`

const Description = styled(Text)`
  text-align: center;
`

const ButtonRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;

  border-bottom-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};
`

const StatusButton = styled(Button)`
  flex-basis: 50%;
  margin-vertical: 0;
  border-radius: 0;
  padding-vertical: 9;
  font-family: ${typography.secondary};

  border-bottom-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};
`

export const Card = observer(function Card() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  // const navigateBack = () => navigation.goBack()
  return (
    <Container>
      <Content>
        <Title>March 10, 2021</Title>
        <Description>Activity</Description>
        <Description>9:30 AM - 10:30 AM</Description>
      </Content>
      <ButtonRow>
        <StatusButton text="Unmatched" />
        <StatusButton text="Reschedule" />
      </ButtonRow>
    </Container>
  )
})
