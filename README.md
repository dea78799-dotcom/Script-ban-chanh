-- [[ TẢI RAYFIELD ]]
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

-- [[ CỬA SỔ CHÍNH ]]
local Window = Rayfield:CreateWindow({
   Name = "🍋menu bán chanh🍋 v3.270 (Pet Added)",
   Icon = 0,
   LoadingTitle = "Đang tải...",
   LoadingSubtitle = "by Assistant",
   ConfigurationSaving = { Enabled = false },
   Discord = { Enabled = false },
   KeySystem = false
})

-- SERVICES
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
local RootPart = Character:WaitForChild("HumanoidRootPart")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local VirtualInputManager = game:GetService("VirtualInputManager")
local GuiService = game:GetService("GuiService")

Player.CharacterAdded:Connect(function(newChar)
    Character = newChar
    RootPart = Character:WaitForChild("HumanoidRootPart")
end)

-- STATE & THREADS & VALUES
local _G_AutoUpgrade = false
local _G_AutoHarvest = false
local _G_AutoRedeem = false
local _G_AutoClickLemonStand = false
local _G_AutoClickLemonDash = false
local _G_AutoClickLemonLabs = false
local _G_AutoClickLemonRobotics = false
local _G_AutoBuild = false
local _G_AutoRebirth = false
local _G_AutoEvolve = false
local _G_AutoOffer = false
local _G_AutoRaiseOffer = false
local _G_AutoRejectOffer = false
local _G_AutoRollBall = false

local UpgradeAmount = 10
local RebirthDelay = 15

local Threads = {
    Upgrade = nil,
    Build = nil,
    Harvest = nil,
    Redeem = nil,
    LemonStand = nil,
    LemonDash = nil,
    LemonLabs = nil,
    LemonRobotics = nil,
    Rebirth = nil,
    Evolve = nil,
    Offer = nil,
    RaiseOffer = nil,
    RejectOffer = nil,
    RollBall = nil
}

-- ============================
-- HÀM GIẢ LẬP CẢM ỨNG UI
-- ============================
local function touchAtPosition(x, y)
    VirtualInputManager:SendTouchEvent(0, 0, x, y, game)
    task.wait(0.02)
    VirtualInputManager:SendTouchEvent(0, 2, x, y, game)
end

local function clickGuiObject(guiObject)
    if not guiObject then return end
    
    if firesignal then
        pcall(function() firesignal(guiObject.MouseButton1Click) end)
        pcall(function() firesignal(guiObject.Activated) end)
    else
        local pos = guiObject.AbsolutePosition
        local size = guiObject.AbsoluteSize
        local inset = GuiService:GetGuiInset()
        
        local x = pos.X + (size.X / 2)
        local y = pos.Y + (size.Y / 2) + inset.Y
        
        touchAtPosition(x, y)
    end
end

-- ============================
-- HÀM TÌM TYCOON CỦA NGƯỜI CHƠI
-- ============================
local function getMyTycoon()
    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            local owner = tycoon:FindFirstChild("Owner") or tycoon:FindFirstChild("OwnerValue")
            if owner and owner.Value == Player then
                return tycoon
            end
        end
    end

    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            if tycoon:FindFirstChild(Player.Name) or tycoon:FindFirstChild(Player.DisplayName) then
                return tycoon
            end
        end
    end

    local closestTycoon = nil
    local shortestDistance = math.huge
    if RootPart then
        for _, tycoon in ipairs(Workspace:GetChildren()) do
            if tycoon.Name:sub(1, 6) == "Tycoon" then
                local primaryPart = tycoon.PrimaryPart or tycoon:FindFirstChildWhichIsA("BasePart", true)
                if primaryPart then
                    local dist = (RootPart.Position - primaryPart.Position).Magnitude
                    if dist < shortestDistance then
                        shortestDistance = dist
                        closestTycoon = tycoon
                    end
                end
            end
        end
    end

    return closestTycoon
end

-- ============================
-- HÀM DỊCH CHUYỂN BẰNG CFRAME
-- ============================
local function teleportCFrame(cframe)
    if not RootPart then return end
    RootPart.CFrame = cframe
end

-- ============================
-- HÀM MUA NÔNG TRẠI (UNLOCK ORCHARD)
-- ============================
local function BuyOrchard()
    pcall(function()
        local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7")
        if myTycoon then
            local remotes = myTycoon:FindFirstChild("Remotes")
            if remotes then
                local unlockOrchard = remotes:FindFirstChild("UnlockOrchard")
                if unlockOrchard and unlockOrchard:IsA("RemoteFunction") then
                    unlockOrchard:InvokeServer()
                    Rayfield:Notify({Title = "🌳", Content = "Đã gửi lệnh Mua nông trại!", Duration = 3})
                    return
                end
            end
        end
        Workspace:WaitForChild("Tycoon7"):WaitForChild("Remotes"):WaitForChild("UnlockOrchard"):InvokeServer()
        Rayfield:Notify({Title = "🌳", Content = "Đã gửi lệnh Mua nông trại (Tycoon7)!", Duration = 3})
    end)
end

-- ============================
-- HÀM THỰC HIỆN NÂNG CẤP
-- ============================
local function DoUpgrade(amount)
    if not _G_AutoUpgrade then return end
    local tycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon2")
    if not tycoon then return end

    local purchases = tycoon:FindFirstChild("Purchases")
    if not purchases then return end

    for _, item in pairs(purchases:GetDescendants()) do
        if not _G_AutoUpgrade then break end

        if item:IsA("RemoteFunction") and item.Name == "Upgrade" then
            task.spawn(function()
                for i = 1, amount do
                    if not _G_AutoUpgrade then break end
                    pcall(function()
                        item:InvokeServer(1)
                    end)
                end
            end)
        end
    end
end

-- ============================
-- HÀM THỰC HIỆN TÁI SINH
-- ============================
local function DoRebirth()
    pcall(function()
        local myTycoon = getMyTycoon()
        local rebirthRemote = nil
        
        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("Rebirth") then
            rebirthRemote = myTycoon.Remotes.Rebirth
        else
            rebirthRemote = Workspace:FindFirstChild("Rebirth", true) or ReplicatedStorage:FindFirstChild("Rebirth", true)
        end

        if rebirthRemote then
            if rebirthRemote:IsA("RemoteFunction") then
                rebirthRemote:InvokeServer(nil)
            elseif rebirthRemote:IsA("RemoteEvent") then
                rebirthRemote:FireServer(nil)
            end
        end
    end)
end

-- ============================
-- HÀM THỰC HIỆN TÁI SINH TRÁI (EVOLVE)
-- ============================
local function DoEvolve()
    pcall(function()
        local myTycoon = getMyTycoon()
        local evolveRemote = nil

        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("Evolve") then
            evolveRemote = myTycoon.Remotes.Evolve
        elseif Workspace:FindFirstChild("Tycoon4") and Workspace.Tycoon4:FindFirstChild("Remotes") and Workspace.Tycoon4.Remotes:FindFirstChild("Evolve") then
            evolveRemote = Workspace.Tycoon4.Remotes.Evolve
        else
            evolveRemote = Workspace:FindFirstChild("Evolve", true)
        end

        if evolveRemote then
            if evolveRemote:IsA("RemoteFunction") then
                evolveRemote:InvokeServer(nil)
            elseif evolveRemote:IsA("RemoteEvent") then
                evolveRemote:FireServer(nil)
            end
        end
    end)
end

-- ============================
-- HÀM LẤY PET SLIME
-- ============================
local function ClaimSlimePet()
    pcall(function()
        local myTycoon = getMyTycoon()
        local claimRemote = nil

        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("ClaimCompanion") then
            claimRemote = myTycoon.Remotes.ClaimCompanion
        elseif Workspace:FindFirstChild("Tycoon3") and Workspace.Tycoon3:FindFirstChild("Remotes") and Workspace.Tycoon3.Remotes:FindFirstChild("ClaimCompanion") then
            claimRemote = Workspace.Tycoon3.Remotes.ClaimCompanion
        else
            claimRemote = Workspace:FindFirstChild("ClaimCompanion", true)
        end

        if claimRemote then
            if claimRemote:IsA("RemoteFunction") then
                claimRemote:InvokeServer(2)
            elseif claimRemote:IsA("RemoteEvent") then
                claimRemote:FireServer(2)
            end
            Rayfield:Notify({Title = "🧪", Content = "Đã gửi lệnh nhận Pet Slime!", Duration = 3})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Remote nhận Pet!", Duration = 3})
        end
    end)
end

-- ============================
-- HÀM XỬ LÝ HỢP ĐỒNG (OFFER)
-- ============================
local function SendOfferAction(actionType)
    pcall(function()
        local myTycoon = getMyTycoon()
        local offerRemote = nil
        
        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("PhoneOffer") then
            offerRemote = myTycoon.Remotes.PhoneOffer
        elseif Workspace:FindFirstChild("Tycoon7") and Workspace.Tycoon7:FindFirstChild("Remotes") and Workspace.Tycoon7.Remotes:FindFirstChild("PhoneOffer") then
            offerRemote = Workspace.Tycoon7.Remotes.PhoneOffer
        else
            offerRemote = Workspace:FindFirstChild("PhoneOffer", true)
        end

        if offerRemote then
            offerRemote:FireServer(actionType)
        end
    end)
end

local function AcceptContract() SendOfferAction("Accept") end
local function RaiseContract() SendOfferAction("Raise") end
local function RejectContract() SendOfferAction("Reject") end

-- ============================
-- HÀM TÌM QUẢ "Fruit" TRONG LemonTree
-- ============================
local function FindFruitsInLemonTrees()
    local fruits = {}
    for _, v in pairs(Workspace:GetDescendants()) do
        if v:IsA("BasePart") and v.Name == "Fruit" and v.Parent then
            local parentModel = v:FindFirstAncestor("LemonTree")
            if parentModel and parentModel:IsA("Model") and parentModel.Name == "LemonTree" then
                table.insert(fruits, v)
            end
        end
    end
    return fruits
end

local function FindClickDetector(fruit)
    local clickPart = fruit:FindFirstChild("ClickFruitPart")
    if clickPart then
        local clickDetector = clickPart:FindFirstChildWhichIsA("ClickDetector")
        if clickDetector then return clickDetector end
    end
    return fruit:FindFirstChildWhichIsA("ClickDetector")
end

local function ClickFruit(fruit)
    local clickDetector = FindClickDetector(fruit)
    if not clickDetector then return false end

    if fireclickdetector then
        pcall(function() fireclickdetector(clickDetector) end)
        return true
    end

    if clickDetector.MouseClick then
        pcall(function() firesignal(clickDetector.MouseClick) end)
        return true
    end

    return false
end

local function HarvestOnce()
    local fruits = FindFruitsInLemonTrees()
    if #fruits == 0 then return false end

    for _, fruit in ipairs(fruits) do
        if not _G_AutoHarvest then break end
        if fruit and fruit.Parent then
            teleportCFrame(CFrame.new(fruit.Position + Vector3.new(0, 2, 0)))
            task.wait(0.02)
            ClickFruit(fruit)
            task.wait(0.02)
        end
    end
    return true
end

local function CollectMoneyOnce()
    pcall(function()
        local core = ReplicatedStorage:FindFirstChild("Core")
        if core then
            local remoteRequest = core:FindFirstChild("RemoteRequest")
            if remoteRequest then
                local redeemRemote = remoteRequest:FindFirstChild("DropService.Redeem")
                if redeemRemote and redeemRemote:IsA("RemoteFunction") then
                    redeemRemote:InvokeServer(tostring(math.random(1, 1500)))
                end
            end
        end
    end)
end

local function ClickIncomeStream(itemName)
    local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon2")
    if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("WakeIncomeStream") then
        pcall(function()
            myTycoon.Remotes.WakeIncomeStream:InvokeServer(itemName)
        end)
    else
        for _, v in pairs(Workspace:GetDescendants()) do
            if (v:IsA("RemoteFunction") or v:IsA("RemoteEvent")) and v.Name == "WakeIncomeStream" then
                pcall(function()
                    if v:IsA("RemoteFunction") then
                        v:InvokeServer(itemName)
                    else
                        v:FireServer(itemName)
                    end
                end)
            end
        end
    end
end

-- ============================
-- TAB FARM
-- ============================
local FarmTab = Window:CreateTab("Farm", 4483362458)

FarmTab:CreateParagraph({
    Title = "⚠️ LƯU Ý QUAN TRỌNG",
    Content = "Khuyến cáo: KHÔNG ĐƯỢC BẬT 2 TÍNH NĂNG CÙNG 1 LÚC TRONG TAB FARM! Hãy tắt tính năng đang chạy trước khi bật tính năng mới."
})

FarmTab:CreateButton({
    Name = "Mua nông trại",
    Callback = function()
        BuyOrchard()
    end,
})

FarmTab:CreateParagraph({
    Title = "⚡ Nâng cấp Cực Nhanh",
    Content = "Tự động gửi gói tin nâng cấp liên tục không bị gián đoạn."
})

FarmTab:CreateToggle({
    Name = "Nâng cấp (Siêu Nhanh)",
    CurrentValue = false,
    Flag = "ToggleUpgrade",
    Callback = function(Value)
        _G_AutoUpgrade = Value
        if Threads.Upgrade then
            task.cancel(Threads.Upgrade)
            Threads.Upgrade = nil
        end

        if _G_AutoUpgrade then
            Rayfield:Notify({Title = "⚡", Content = "Đã bật tự động nâng cấp Siêu Nhanh!", Duration = 2})
            Threads.Upgrade = task.spawn(function()
                while _G_AutoUpgrade do
                    DoUpgrade(UpgradeAmount)
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT nâng cấp!", Duration = 2})
        end
    end
})

FarmTab:CreateSlider({
    Name = "Số lần gửi lệnh / 1 nhịp",
    Range = {1, 100},
    Increment = 1,
    Suffix = "lần",
    CurrentValue = 10,
    Flag = "SliderUpgradeAmount",
    Callback = function(Value)
        UpgradeAmount = Value
    end,
})

FarmTab:CreateParagraph({
    Title = "🏠 Tự động xây nhà",
    Content = "Mua các nút còn thiếu trong Tycoon."
})

FarmTab:CreateButton({
    Name = "Kiểm tra Tycoon hiện tại",
    Callback = function()
        local myTycoon = getMyTycoon()
        if myTycoon then
            Rayfield:Notify({Title = "🏠 Tycoon", Content = "Đã xác nhận: " .. myTycoon.Name, Duration = 3})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Tycoon nào!", Duration = 3})
        end
    end,
})

FarmTab:CreateToggle({
    Name = "Tự động xây dựng nhà",
    CurrentValue = false,
    Flag = "ToggleBuildHouse",
    Callback = function(Value)
        _G_AutoBuild = Value
        if Threads.Build then
            task.cancel(Threads.Build)
            Threads.Build = nil
        end

        if _G_AutoBuild then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động xây dựng!", Duration = 2})
            Threads.Build = task.spawn(function()
                while _G_AutoBuild do
                    local myTycoon = getMyTycoon()
                    if myTycoon then
                        for _, obj in pairs(myTycoon:GetDescendants()) do
                            if not _G_AutoBuild then break end

                            if obj:IsA("RemoteFunction") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                task.spawn(function()
                                    pcall(function() obj:InvokeServer(false, false) end)
                                end)
                            elseif obj:IsA("RemoteEvent") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                task.spawn(function()
                                    pcall(function() obj:FireServer(false, false) end)
                                end)
                            end
                        end
                    end
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động xây nhà!", Duration = 2})
        end
    end
})

-- ============================
-- TAB MINI GAME
-- ============================
local MiniGameTab = Window:CreateTab("Mini Game", 4483362458)

MiniGameTab:CreateParagraph({
    Title = "⚠️ LƯU Ý BẢO TRÌ",
    Content = "Đang trong quá trình test/sửa, vui lòng đừng xài!"
})

MiniGameTab:CreateToggle({
    Name = "Lăn bóng",
    CurrentValue = false,
    Flag = "ToggleRollBall",
    Callback = function(Value)
        _G_AutoRollBall = Value
        if Threads.RollBall then
            task.cancel(Threads.RollBall)
            Threads.RollBall = nil
        end

        if _G_AutoRollBall then
            Rayfield:Notify({Title = "⚽", Content = "Đã BẬT quy trình Lăn Bóng!", Duration = 2})
            Threads.RollBall = task.spawn(function()
                while _G_AutoRollBall do
                    local myTycoon = getMyTycoon()
                    local targetCFrame = nil

                    if myTycoon then
                        local tName = myTycoon.Name
                        if tName == "Tycoon1" then
                            targetCFrame = CFrame.new(35.0306549, 6.0, -428.579681, -1, 0, 0, 0, 1, 0, 0, 0, -1)
                        elseif tName == "Tycoon2" then
                            targetCFrame = CFrame.new(35.0306549, 6.0, -248.579666, -1, 0, 0, 0, 1, 0, 0, 0, -1)
                        elseif tName == "Tycoon3" then
                            targetCFrame = CFrame.new(35.0306549, 6.0, -68.5796585, -1, 0, 0, 0, 1, 0, 0, 0, -1)
                        elseif tName == "Tycoon4" then
                            targetCFrame = CFrame.new(35.0306549, 6.0, 111.420341, -1, 0, 0, 0, 1, 0, 0, 0, -1)
                        elseif tName == "Tycoon6" then
                            targetCFrame = CFrame.new(-35.0306129, 6.0, 428.579681, 1, 0, 0, 0, 1, 0, 0, 0, 1)
                        elseif tName == "Tycoon7" then
                            targetCFrame = CFrame.new(-35.0306282, 6.0, 248.579666, 1, 0, 0, 0, 1, 0, 0, 0, 1)
                        elseif tName == "Tycoon8" then
                            targetCFrame = CFrame.new(-35.0306473, 6.0, 68.5796585, 1, 0, 0, 0, 1, 0, 0, 0, 1)
                        elseif tName == "Tycoon9" then
                            targetCFrame = CFrame.new(-35.0306625, 6.0, -111.420341, 1, 0, 0, 0, 1, 0, 0, 0, 1)
                        end
                    end

                    if not targetCFrame then
                        targetCFrame = CFrame.new(-35.0306473, 6.0, 68.5796585)
                    end

                    teleportCFrame(targetCFrame)
                    
                    pcall(function()
                        local event = ReplicatedStorage:WaitForChild("Core", 3)
                            :WaitForChild("RemoteRequest", 3)
                            :WaitForChild("MinigameRaceService.Start", 3)
                        if event and event:IsA("RemoteFunction") then
                            event:InvokeServer()
                        end
                    end)

                    task.wait(0.2)
                    if not _G_AutoRollBall then break end

                    local playerGui = Player:WaitForChild("PlayerGui")
                    local chonButtons = {}

                    for _, v in pairs(playerGui:GetDescendants()) do
                        if v:IsA("TextButton") or v:IsA("ImageButton") then
                            if v:IsA("TextButton") and string.find(string.lower(v.Text), "chọn") then
                                table.insert(chonButtons, v)
                            end
                        end
                    end

                    table.sort(chonButtons, function(a, b)
                        return a.AbsolutePosition.X < b.AbsolutePosition.X
                    end)

                    if #chonButtons >= 2 then
                        clickGuiObject(chonButtons[2])
                    end

                    task.wait(0.5)

                    local startTime = tick()
                    local duration = 20

                    while (tick() - startTime < duration) and _G_AutoRollBall do
                        local coVuBtn = nil
                        for _, v in pairs(playerGui:GetDescendants()) do
                            if v:IsA("TextButton") and string.find(string.lower(v.Text), "cổ vũ") then
                                coVuBtn = v
                                break
                            end
                        end
                        
                        if coVuBtn then
                            clickGuiObject(coVuBtn)
                        end
                        
                        task.wait(0.07)
                    end

                    if not _G_AutoRollBall then break end

                    task.wait(5)

                    if _G_AutoRollBall then
                        local camera = Workspace.CurrentCamera
                        if camera then
                            local viewportSize = camera.ViewportSize
                            local inset = GuiService:GetGuiInset()

                            local centerX = viewportSize.X * 0.5
                            local centerY = (viewportSize.Y * 0.5) + inset.Y

                            touchAtPosition(centerX, centerY)
                        end
                    end

                    task.wait(1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT lăn bóng!", Duration = 2})
        end
    end
})

-- ============================
-- TAB HỢP ĐỒNG
-- ============================
local ContractTab = Window:CreateTab("Hợp Đồng", 4483362458)

ContractTab:CreateButton({
    Name = "Đồng ý hợp đồng",
    Callback = function()
        AcceptContract()
        Rayfield:Notify({Title = "📜", Content = "Đã đồng ý hợp đồng!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động đồng ý",
    CurrentValue = false,
    Flag = "ToggleAutoOffer",
    Callback = function(Value)
        _G_AutoOffer = Value
        if Threads.Offer then
            task.cancel(Threads.Offer)
            Threads.Offer = nil
        end

        if _G_AutoOffer then
            Rayfield:Notify({Title = "📜", Content = "Đã BẬT tự động đồng ý hợp đồng!", Duration = 2})
            Threads.Offer = task.spawn(function()
                while _G_AutoOffer do
                    AcceptContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động đồng ý!", Duration = 2})
        end
    end
})

ContractTab:CreateButton({
    Name = "Thêm tiền hợp đồng",
    Callback = function()
        RaiseContract()
        Rayfield:Notify({Title = "💵", Content = "Đã yêu cầu tăng tiền!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động kêu thêm tiền",
    CurrentValue = false,
    Flag = "ToggleAutoRaiseOffer",
    Callback = function(Value)
        _G_AutoRaiseOffer = Value
        if Threads.RaiseOffer then
            task.cancel(Threads.RaiseOffer)
            Threads.RaiseOffer = nil
        end

        if _G_AutoRaiseOffer then
            Rayfield:Notify({Title = "💵", Content = "Đã BẬT tự động tăng tiền!", Duration = 2})
            Threads.RaiseOffer = task.spawn(function()
                while _G_AutoRaiseOffer do
                    RaiseContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT!", Duration = 2})
        end
    end
})

ContractTab:CreateButton({
    Name = "Từ chối hợp đồng",
    Callback = function()
        RejectContract()
        Rayfield:Notify({Title = "❌", Content = "Đã từ chối hợp đồng!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động từ chối",
    CurrentValue = false,
    Flag = "ToggleAutoRejectOffer",
    Callback = function(Value)
        _G_AutoRejectOffer = Value
        if Threads.RejectOffer then
            task.cancel(Threads.RejectOffer)
            Threads.RejectOffer = nil
        end

        if _G_AutoRejectOffer then
            Rayfield:Notify({Title = "❌", Content = "Đã BẬT tự động từ chối!", Duration = 2})
            Threads.RejectOffer = task.spawn(function()
                while _G_AutoRejectOffer do
                    RejectContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT!", Duration = 2})
        end
    end
})

-- ============================
-- TAB TÁI SINH (REBIRTH)
-- ============================
local RebirthTab = Window:CreateTab("Tái Sinh", 4483362458)

RebirthTab:CreateButton({
    Name = "Tái sinh ngay",
    Callback = function()
        DoRebirth()
        Rayfield:Notify({Title = "🔄", Content = "Đã thực hiện tái sinh!", Duration = 2})
    end,
})

RebirthTab:CreateSlider({
    Name = "Thời gian tái sinh (Phút)",
    Range = {1, 180},
    Increment = 1,
    Suffix = "phút",
    CurrentValue = 15,
    Flag = "SliderRebirthDelay",
    Callback = function(Value)
        RebirthDelay = Value
    end,
})

RebirthTab:CreateToggle({
    Name = "Tự động tái sinh",
    CurrentValue = false,
    Flag = "ToggleAutoRebirth",
    Callback = function(Value)
        _G_AutoRebirth = Value
        if Threads.Rebirth then
            task.cancel(Threads.Rebirth)
            Threads.Rebirth = nil
        end

        if _G_AutoRebirth then
            Rayfield:Notify({Title = "🔄", Content = "Đã BẬT tự động tái sinh sau " .. RebirthDelay .. " phút!", Duration = 3})
            Threads.Rebirth = task.spawn(function()
                while _G_AutoRebirth do
                    local totalWaitSeconds = RebirthDelay * 60
                    for i = 1, totalWaitSeconds do
                        if not _G_AutoRebirth then break end
                        task.wait(1)
                    end
                    if _G_AutoRebirth then
                        DoRebirth()
                    end
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tái sinh tự động!", Duration = 2})
        end
    end
})

RebirthTab:CreateParagraph({
    Title = "🍋 Tái sinh trái (Evolve)",
    Content = "Thực hiện tiến hóa/tái sinh trái cây trong Tycoon."
})

RebirthTab:CreateButton({
    Name = "Tái sinh trái",
    Callback = function()
        DoEvolve()
        Rayfield:Notify({Title = "🍋", Content = "Đã thực hiện Tái sinh trái!", Duration = 2})
    end,
})

RebirthTab:CreateToggle({
    Name = "tự động tái sinh trái",
    CurrentValue = false,
    Flag = "ToggleAutoEvolve",
    Callback = function(Value)
        _G_AutoEvolve = Value
        if Threads.Evolve then
            task.cancel(Threads.Evolve)
            Threads.Evolve = nil
        end

        if _G_AutoEvolve then
            Rayfield:Notify({Title = "🍋", Content = "Đã BẬT tự động tái sinh trái (Mỗi 30s)!", Duration = 3})
            Threads.Evolve = task.spawn(function()
                while _G_AutoEvolve do
                    DoEvolve()
                    for i = 1, 30 do
                        if not _G_AutoEvolve then break end
                        task.wait(1)
                    end
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động tái sinh trái!", Duration = 2})
        end
    end
})

-- ============================
-- TAB AUTO HARVEST
-- ============================
local HarvestTab = Window:CreateTab("Auto Harvest", 4483362458)

HarvestTab:CreateToggle({
    Name = "Tự động hái quả",
    CurrentValue = false,
    Flag = "ToggleHarvest",
    Callback = function(Value)
        _G_AutoHarvest = Value
        if Threads.Harvest then
            task.cancel(Threads.Harvest)
            Threads.Harvest = nil
        end

        if _G_AutoHarvest then
            Threads.Harvest = task.spawn(function()
                while _G_AutoHarvest do
                    HarvestOnce()
                    task.wait(0.1)
                end
            end)
        end
    end
})

HarvestTab:CreateToggle({
    Name = "Nhặt bao tiền",
    CurrentValue = false,
    Flag = "ToggleCollectMoney",
    Callback = function(Value)
        _G_AutoRedeem = Value
        if Threads.Redeem then
            task.cancel(Threads.Redeem)
            Threads.Redeem = nil
        end

        if _G_AutoRedeem then
            Threads.Redeem = task.spawn(function()
                while _G_AutoRedeem do
                    CollectMoneyOnce()
                    task.wait(0.01)
                end
            end)
        end
    end
})

-- ============================
-- TAB CLICK
-- ============================
local ClickTab = Window:CreateTab("Click", 4483362458)

ClickTab:CreateToggle({
    Name = "Auto Click LemonStand",
    CurrentValue = false,
    Flag = "ToggleClickLemonStand",
    Callback = function(Value)
        _G_AutoClickLemonStand = Value
        if Threads.LemonStand then
            task.cancel(Threads.LemonStand)
            Threads.LemonStand = nil
        end

        if _G_AutoClickLemonStand then
            Threads.LemonStand = task.spawn(function()
                while _G_AutoClickLemonStand do
                    ClickIncomeStream("LemonStand")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonDash",
    CurrentValue = false,
    Flag = "ToggleClickLemonDash",
    Callback = function(Value)
        _G_AutoClickLemonDash = Value
        if Threads.LemonDash then
            task.cancel(Threads.LemonDash)
            Threads.LemonDash = nil
        end

        if _G_AutoClickLemonDash then
            Threads.LemonDash = task.spawn(function()
                while _G_AutoClickLemonDash do
                    ClickIncomeStream("LemonDash")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonLabs",
    CurrentValue = false,
    Flag = "ToggleClickLemonLabs",
    Callback = function(Value)
        _G_AutoClickLemonLabs = Value
        if Threads.LemonLabs then
            task.cancel(Threads.LemonLabs)
            Threads.LemonLabs = nil
        end

        if _G_AutoClickLemonLabs then
            Threads.LemonLabs = task.spawn(function()
                while _G_AutoClickLemonLabs do
                    ClickIncomeStream("LemonLabs")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonRobotics",
    CurrentValue = false,
    Flag = "ToggleClickLemonRobotics",
    Callback = function(Value)
        _G_AutoClickLemonRobotics = Value
        if Threads.LemonRobotics then
            task.cancel(Threads.LemonRobotics)
            Threads.LemonRobotics = nil
        end

        if _G_AutoClickLemonRobotics then
            Threads.LemonRobotics = task.spawn(function()
                while _G_AutoClickLemonRobotics do
                    ClickIncomeStream("LemonRobotics")
                    task.wait(0.05)
                end
            end)
        end
    end
})

-- ============================
-- TAB PET
-- ============================
local PetTab = Window:CreateTab("Pet", 4483362458)

PetTab:CreateParagraph({
    Title = "⚠️ LƯU Ý",
    Content = "Bạn cần phải hoàn thành nhiệm vụ mới lấy được do tab pet đang sửa chữa"
})

PetTab:CreateButton({
    Name = "Lấy pet slime",
    Callback = function()
        ClaimSlimePet()
    end,
})

Rayfield:Notify({Title = "🍋", Content = "🍋menu bán chanh🍋 v3.270 đã sẵn sàng!", Duration = 3})
