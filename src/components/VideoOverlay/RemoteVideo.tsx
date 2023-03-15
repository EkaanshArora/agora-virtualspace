import type { Vector3 } from "three";
import { type IRemoteVideoTrack } from "../../agora-rtc-react";
import { AgoraVideoPlayer } from "../../agora-rtc-react";
import type { remoteUserType } from "../types";
import { AgoraDict } from "../GameContainer";
import { api } from "../../utils/api";
import { MutedVideo } from "./MutedVideo";
import { distanceToUnsubscribe } from "../utils";

export const RemoteVideo = (props: {
  u: string;
  remoteUsers: remoteUserType;
  playerPos: Vector3;
}) => {
  const { playerPos, remoteUsers, u } = props;
  const { data } = api.example.getUserName.useQuery({ agoraId: parseInt(u) });
  return (
    <>
      {AgoraDict[parseInt(u)]?.agoraUser.videoTrack ? (
        <div
          style={
            remoteUsers[parseInt(u)]?.position
              ? {
                  opacity: 1 / (playerPos.distanceTo(remoteUsers[parseInt(u)]!.position) * distanceToUnsubscribe),
                }
              : {}
          }
        >
          <AgoraVideoPlayer
            className="mx-1 h-full w-28 overflow-hidden rounded-full"
            videoTrack={AgoraDict[parseInt(u)]?.agoraUser.videoTrack as IRemoteVideoTrack}
          />
        </div>
      ) : (
        AgoraDict[parseInt(u)]?.agoraUser.audioTrack && <MutedVideo name={data?.name} />
      )}
    </>
  );
};
