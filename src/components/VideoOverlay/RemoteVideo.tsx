import type { Vector3 } from "three";
import { type IRemoteVideoTrack } from "../../agora-rtc-react";
import { AgoraVideoPlayer } from "../../agora-rtc-react";
import type { remoteUserType } from "../types";
import { AgoraDict } from "../GameContainer";
import { api } from "../../utils/api";
import { MutedVideo } from "../../ui/MutedVideo";
import { distanceToUnsubscribe } from "../utils";

export const RemoteVideo = (props: {
  uid: string;
  remoteUsers: remoteUserType;
  playerPos: Vector3;
}) => {
  const { playerPos, remoteUsers, uid } = props;
  const { data } = api.main.getUserName.useQuery({ agoraId: parseInt(uid) });
  const opacityValue = remoteUsers[parseInt(uid)]?.position
    ? {
        opacity:
          1 /
          (playerPos.distanceTo(remoteUsers[parseInt(uid)]?.position as Vector3) *
            distanceToUnsubscribe),
      }
    : {};
  return (
    <>
      {AgoraDict[parseInt(uid)]?.agoraUser.videoTrack ? (
        <div className="mx-1" style={opacityValue}>
          <AgoraVideoPlayer
            className="h-24 w-24 overflow-hidden rounded-full"
            videoTrack={AgoraDict[parseInt(uid)]?.agoraUser.videoTrack as IRemoteVideoTrack}
          />
          <div className="m-1 rounded-full bg-white leading-tight opacity-60">
            <p className="m-auto w-20 justify-center self-center overflow-hidden text-ellipsis whitespace-nowrap align-middle text-sm">
              {data?.name ? data.name.split(" ")[0] : "user"}
            </p>
          </div>
        </div>
      ) : (
        AgoraDict[parseInt(uid)]?.agoraUser.audioTrack && <MutedVideo name={data?.name} />
      )}
    </>
  );
};
