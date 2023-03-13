import type { Vector3 } from "three";
import { type IRemoteVideoTrack } from "../../agora-rtc-react";
import { AgoraVideoPlayer } from "../../agora-rtc-react";
import type { remoteUserType } from "../types";
import { AgoraDict } from "../GameContainer";
import { api } from "../../utils/api";
import { MutedVideo } from "./MutedVideo";

export const RemoteVideo = (props: { u: string; remoteUsers: remoteUserType; playerPos: Vector3; }) => {
  const { playerPos, remoteUsers, u } = props;
  const { data } = api.example.getUserName.useQuery({ agoraId: parseInt(u) });
  return (
    <>
      {AgoraDict[parseInt(u)]?.agoraUser.videoTrack ? (
        <div
          style={remoteUsers[parseInt(u)]?.position
            ? {
              opacity: 1 / playerPos.distanceTo(remoteUsers[parseInt(u)]!.position),
            }
            : {}}
        >
          <AgoraVideoPlayer
            className="h-full w-48"
            videoTrack={AgoraDict[parseInt(u)]?.agoraUser.videoTrack as IRemoteVideoTrack} />
        </div>
      ) : (
        AgoraDict[parseInt(u)]?.agoraUser.audioTrack && (
          <MutedVideo name={data?.name} />
        )
      )}
    </>
  );
};
