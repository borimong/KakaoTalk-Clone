import React, { ChangeEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import { UserResponseDto } from '../../types/user';
import { ProfileChangeRequestDto } from '../../types/profile';
import { uploadImageFile } from '../../apis/user';
import { BASE_IMG_URL } from '../../constants';

const BgImageSettingWrapper = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  & i {
    font-size: 15px;
    color: #fff;
    cursor: pointer;
  }
`;
const ProfileImageSettingWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: auto;
  margin-bottom: 10px;
  & img {
    display: block;
    width: 90px;
    height: 90px;
    border-radius: 35px;
    cursor: pointer;
  }
`;
const FriendProfileImageWrapper = styled(ProfileImageSettingWrapper)`
  & img {
    cursor: auto;
  }
`;
const SettingBlock = styled.div`
  position: absolute;
  width: 130px;
  border: 1px solid #646464;
  background: #fff;
  text-align: start;
  z-index: 100;
  &.bgSetting {
    top: 20px;
  }
  &.profileSetting {
    top: 90px;
    left: 50px;
  }
  &.hideSetting {
    top: -9999px;
  }
  & p {
    color: #000;
    font-size: 12px;
    min-height: 19px;
    padding: 7px 5px;
    cursor: pointer;
    &:hover {
      background: #f0f0f0;
    }
  }
  & input {
    display: none;
  }
`;

interface SettingProps {
  userData: UserResponseDto;
  isShowSetting: boolean;
  showSetting(isShowSettign: boolean): void;
  changeProfile(profileData: ProfileChangeRequestDto): void;
}

interface SettingBlockProps {
  className: string;
  showSetting(isShowSettign: boolean): void;
  changeImage(imageUrl: string): void;
  changeToInitImage(): void;
}

export const BgImageSetting: React.FC<SettingProps> = ({
  userData,
  isShowSetting,
  showSetting,
  changeProfile
}) => {
  const settingClassName = `bgSetting ${!isShowSetting ? 'hideSetting' : ''}`;
  const id = userData.id;
  const changeImage = async (imageUrl: string) => {
    await changeProfile({ id, background_img_url: imageUrl });
  };
  const changeToInitImage = async () => {
    await changeProfile({ id, background_img_url: '' });
  };
  return (
    <BgImageSettingWrapper>
      <i className="fas fa-image" onClick={() => showSetting(true)} />
      <Setting
        className={settingClassName}
        showSetting={showSetting}
        changeImage={changeImage}
        changeToInitImage={changeToInitImage}
      />
    </BgImageSettingWrapper>
  );
};

export const ProfileImageSetting: React.FC<SettingProps> = ({
  userData,
  isShowSetting,
  showSetting,
  changeProfile
}) => {
  const settingClassName = `profileSetting ${
    !isShowSetting ? 'hideSetting' : ''
  }`;
  const id = userData.id;
  const changeImage = async (imageUrl: string) => {
    await changeProfile({ id, profile_img_url: imageUrl });
  };
  const changeToInitImage = async () => {
    await changeProfile({ id, profile_img_url: '' });
  };
  return (
    <ProfileImageSettingWrapper>
      <img
        src={userData.profile_img_url || BASE_IMG_URL}
        alt="profile_image"
        onClick={() => showSetting(true)}
      />
      <Setting
        className={settingClassName}
        showSetting={showSetting}
        changeImage={changeImage}
        changeToInitImage={changeToInitImage}
      />
    </ProfileImageSettingWrapper>
  );
};

export const FriendProfileImage: React.FC<{ userData: UserResponseDto }> = ({
  userData
}) => {
  return (
    <FriendProfileImageWrapper>
      <img src={userData.profile_img_url || BASE_IMG_URL} alt="profile_image" />
    </FriendProfileImageWrapper>
  );
};

// ?????? ???????????? ????????? ?????? ?????? ??? ???????????? ????????????
const Setting: React.FC<SettingBlockProps> = ({
  className,
  showSetting,
  changeImage,
  changeToInitImage
}) => {
  const settingName = className === 'bgSetting' ? '?????? ??????' : '?????? ??????';
  const validFileType = ['image/bmp', 'image/png', 'image/jpg', 'image/jpeg'];

  // ????????? ????????? ????????? ?????? ????????????.
  const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
      const file = event.target.files[0];
      if (validFileType.includes(file.type)) {
        // ????????? ?????????
        const imageUrl = await uploadImageFile(file);
        await changeImage(imageUrl);
      } else alert('????????? ????????? ???????????????.');
    }
  };

  const onInitSettingClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    showSetting(false);
    changeToInitImage();
  };
  return (
    <SettingBlock className={className}>
      <label>
        <p onClick={() => showSetting(false)}>{settingName}</p>
        <input
          type="file"
          accept=".bmp, .png, .jpg, .jpeg"
          onChange={selectFile}
        />
      </label>
      <p onClick={onInitSettingClick}>?????? ???????????? ??????</p>
    </SettingBlock>
  );
};
