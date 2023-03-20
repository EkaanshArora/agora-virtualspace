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
          className="mx-1"
          style={
            remoteUsers[parseInt(u)]?.position
              ? {
                  opacity: 1 / (playerPos.distanceTo(remoteUsers[parseInt(u)]!.position) * distanceToUnsubscribe),
                }
              : {}
          }
        >
          <AgoraVideoPlayer
            className="h-24 w-24 overflow-hidden rounded-full"
            videoTrack={AgoraDict[parseInt(u)]?.agoraUser.videoTrack as IRemoteVideoTrack}
          />
           <div className="m-1 rounded-full bg-white leading-tight opacity-60">
            <p className="m-auto w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm align-middle self-center justify-center">
              {data?.name ? data.name.split(' ')[0] : 'user'}
            </p>
          </div>
        </div>
      ) : (
        AgoraDict[parseInt(u)]?.agoraUser.audioTrack && <MutedVideo name={data?.name} />
      )}
    </>
  );
};
