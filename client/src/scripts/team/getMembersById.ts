import axios from "axios"
import { Ref } from "vue"
import { teamMemberType } from "./teamMembers"
import { unknownObjectType } from "../utilities/ObjectProperty"
import { refreshTokenWithStatus } from "../utilities/refreshToken"

const getMembersById = (
    message: Ref<string>,
    members: Ref<teamMemberType | null>,
    teamName: Ref<string>,
    plan: Ref<unknownObjectType | null>
) => {
    const connect = async () => {
        axios.get(`/api/v1/teams/`)
        .then((response) => {

            teamName.value = response.data['0'].name
            members.value = response.data['0'].members
            plan.value = response.data['0'].plan
            message.value = ''
        })
        .catch((e) => {
            refreshTokenWithStatus(e.response.data?.code, connect)
            if(e.response.data?.code !== 'token_not_valid') {
                message.value = "Can't Fetch Data!"
                console.error(e)
            }
        })
    }
    connect()
}

export default getMembersById